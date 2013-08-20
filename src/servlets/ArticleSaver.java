package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.SocketTimeoutException;
import java.net.URLDecoder;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.response.UpdateResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrInputDocument;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.util.JSON;

import classes.CalaisCaller;
import classes.MongoConnector;
import classes.SolrConnector;
import classes.StanbolCaller;

/**
 * Servlet implementation class ArticleSaver
 */
@WebServlet("/articlesaver")
public class ArticleSaver extends HttpServlet {
	private static final long serialVersionUID = 1L;
    private static MongoClient mongoClient;
    private static DB db;
    private static DBCollection collection;
    private static SolrServer solr;
    /**
     * @throws UnknownHostException 
     * @see HttpServlet#HttpServlet()
     */
    public ArticleSaver() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request, response);
	}

	/**
	 * @throws IOException 
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		// get the articles json 
		String articlesJson = request.getParameter("articles");
		//System.out.println(articlesJson);
		
		// using JSON Simple plugin
		// parse articles json and store it into object
		Object object = JSONValue.parse(articlesJson);
		// convert the object into jsonobject
		JSONObject articlesObject = (JSONObject)object;
		// get the article array from the jsonobject 
		JSONArray articlesArray = (JSONArray)articlesObject.get("articles");
		
		// initialise mongoclient, db and collection
	        mongoClient = MongoConnector.getConnection();
	        db = mongoClient.getDB("osbii");
	        collection = db.getCollection("articles");
	        // get solr server instance
	        solr = SolrConnector.getSolr();
	        try{
			// iterate through each articles array which is an arraylist and from each article which is a map, extract value of 'summary' key
			for(int i=0; i<articlesArray.size(); i++){
				// parse and get the article array from articles array
				Object o = JSONValue.parse(articlesArray.get(i).toString());
				// get the article object which is a map and stores key-value pairs
				JSONObject articleObject = (JSONObject)o;
				
				// get the title of the article to check in database
				String articleTitle = articleObject.get("title").toString();
				// get the summary key's value from this article
				String content = articleObject.get("summary").toString();
				System.out.println();
				System.out.println();
				System.out.println(content);
				// get the url value of this article
				String articleUrl = articleObject.get("url").toString();
				
				// check if content empty, if empty then don't do anything
				if(content.trim().equals("")||content.trim()==null){
					System.out.println("Content is null!");
					System.out.println();
				}
				else{
					// obtain entities map from StanbolCaller
					Map<String, Set<String>> entityToOriginalTextMap = StanbolCaller.getEntities(content);
					   
					// check if any entities are present or not
					if(entityToOriginalTextMap.size()!=0){
						// array list to store entity labels
						ArrayList<String> entityLabelsList = new ArrayList<>();
						
						// create a string builder json for complete article and entities
						StringBuilder finalJson = new StringBuilder();
						finalJson.append("{\"entities\": [");		
						
						// iterate through each entity and create a json
						for(Iterator<String> entityIterator = entityToOriginalTextMap.keySet().iterator(); entityIterator.hasNext();){
							// entity in the url format
							String entity = entityIterator.next();
							
							// extract entity label
							int lastSlash = entity.lastIndexOf('/');
							// entity label
							String entityLabel = entity.substring(lastSlash+1);
							// decode it as it may be encoded and replace underscores by spaces
							entityLabel = URLDecoder.decode(entityLabel, "UTF-8").replace('_',' ');
							// add the entity label into entityLabelsList to put it into solr for indexing
							entityLabelsList.add(entityLabel);
							
							// write entity and put url, label and references
							finalJson.append("{ \"url\"" +": "+ "\""+entity+"\",");
							finalJson.append("\"label\"" +": "+ "\""+entityLabel+"\",");
							finalJson.append("\"references\"" +": "+ "[");
							// enter all the references now
							for(String s: entityToOriginalTextMap.get(entity)){
								finalJson.append("\"" + s + "\",");
							}
							// remove extra-comma
							if(finalJson.charAt(finalJson.length()-1)==','){
								finalJson.deleteCharAt(finalJson.length()-1);
							}
							
							// entity finished
							finalJson.append("]},");
						}			
						// remove extra comma
						if(finalJson.charAt(finalJson.length()-1)==','){
							finalJson.deleteCharAt(finalJson.length()-1);
						}
						// entity json complete
						finalJson.append("]}");
						
						//System.out.println(finalJson);
						// return this entity map
						
						// create the articles json and add it to finalJson
						String articleJson = "\"article\": " + articlesArray.get(i) + ",";
						finalJson.insert(1, articleJson);
						
						//System.out.println("Article JSON: " + articlesArray.get(i));
						//System.out.println();
						System.out.println("Final JSON: " + finalJson);
						
						// check if article is present in the database by checking it's title
						DBCursor cursor = collection.find(new BasicDBObject("article.title", articleTitle));
						// check if cursor has any documents
						if(cursor.hasNext()){
							System.out.println("Found" + cursor.next());
						}
						else {					
							collection.insert((DBObject)JSON.parse(finalJson.toString()));
							// now again fetch this doc to know its '_id' generated by mongod
							cursor = collection.find(new BasicDBObject("article.title", articleTitle));
							// get the '_id' from the cursor
							String docId = cursor.next().get("_id").toString();
							//System.out.println(docId);
							
							// index the doc into solr
							// create a solrdoc
							SolrInputDocument sDoc = new SolrInputDocument();
							sDoc.addField("id", docId);
							sDoc.addField("title", articleTitle);
							sDoc.addField("description", content);
							sDoc.addField("url", articleUrl);
							
							// add all the entities to solr
							for(String s: entityLabelsList){
								sDoc.addField("entities", s);
							}
							
							// add the doc into solr
							UpdateResponse solrResponse = solr.add(sDoc);
							System.out.println("Added: " + solrResponse.getStatus());					
						}
					}
				}
			}
        } 
		catch (SolrServerException sse){
			sse.printStackTrace();
		}
		finally{		
			try {
				// commit the solr update
				solr.commit();
				System.out.println("Committed");
				System.out.println();
			} catch (SolrServerException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			// close the mongodb connection instance
			MongoConnector.closeConnection(mongoClient);
		}
		
		// response
		PrintWriter out = response.getWriter();
		out.println("Recieved");
	}
}
