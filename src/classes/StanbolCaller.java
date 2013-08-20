package classes;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.http.HttpHeaders;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

public class StanbolCaller {
	// stanbol instance to be used
	private static String stanbolInstance = "http://dev.iks-project.eu:8081/enhancer"; 
	private static HttpClient client;
	private static HttpPost postRequest;
	private static HttpResponse response;
	
	public static Map<String, Set<String>> getEntities(String content){
		// obtain the default httpclient
		client = new DefaultHttpClient();
		
		// obtain a http post request object
		postRequest = new HttpPost(stanbolInstance);
		postRequest.setHeader(HttpHeaders.ACCEPT, "application/json");
		
		try {
			// set the summary as parameter
			postRequest.setEntity(new StringEntity(content));
		} catch (UnsupportedEncodingException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		try {
			// obtain the response
			response = client.execute(postRequest);
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		// stringbuilder which will store the json result
		StringBuilder jsonResult = new StringBuilder();
		
		try {		
			BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
	      		String line = "";
			while ((line = rd.readLine()) != null) {
			    //System.out.println(line);
			    jsonResult.append(line);
			}
		} 
	    	catch (IllegalStateException | IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		//System.out.println(jsonResult.toString());
		
		// using JSON Simple plugin
		// parse stanbol jsonResult and store it into object
		Object object = JSONValue.parse(jsonResult.toString());
		// convert the object into jsonobject
		JSONObject stanbolJsonObject = (JSONObject)object;
		
		// fetch original text of each entity from its relation(s)
		Map<String, Set<String>> entityToOriginalTextMap = new HashMap<>();
		
		// check if graph array is present
		if(stanbolJsonObject.containsKey("@graph")){
			// get the graph array from the jsonobject 
			JSONArray graphArray = (JSONArray)stanbolJsonObject.get("@graph");

			// this map will store each entity's relation(s), from these relations later on fetch original-text 
			Map<String, Set<String>> entityToRelationsMap = new HashMap<>();
			// map to map @id to json object
			Map<String, JSONObject> idToJsonObject = new HashMap<>();

			// associate each entity with its relations
			for(int i=0; i<graphArray.size(); i++){			
				// parse and get the graph element from graph array
				Object o = JSONValue.parse(graphArray.get(i).toString());
				// get the graph	 object which is a map and stores key-value pairs
				JSONObject graphElement = (JSONObject)o;
				
				// add this json-object into idToJsonObject map
				idToJsonObject.put(graphElement.get("@id").toString(), graphElement);
				
				// stanbol json output has key 'enhancer:entity-reference' or 'entity-reference and 'dc:relation' or 'relation'
				if(graphElement.containsKey("entity-reference")||graphElement.containsKey("enhancer:entity-reference")){
					
					String entity;
					String relation;
					JSONArray relationsArray;
					
					if(graphElement.containsKey("entity-reference")){
						// get the entity which is in format http://dbpedia.org/resource/OSBII
						entity = graphElement.get("entity-reference").toString(); 
						// get the relation string
						relation = graphElement.get("relation").toString();
						
						// check if it is an array
						if(relation.contains("[")){
							// get it's relation array
							relationsArray = (JSONArray)graphElement.get("relation");
						}
						else{
							// if not an array then create a new array and add this relation string to it
							relationsArray = new JSONArray();
							relationsArray.add(relation);
						}
						 
					}
					else{
						// get the entity which is in format http://dbpedia.org/resource/OSBII
						entity = graphElement.get("enhancer:entity-reference").toString(); 
						// get the relation string
						relation = graphElement.get("dc:relation").toString();
						
						// check if it is an array
						if(relation.contains("[")){
							// get it's relation array
							relationsArray = (JSONArray)graphElement.get("dc:relation");
						}
						else{
							// if not an array then create a new array and add this relation string to it
							relationsArray = new JSONArray();
							relationsArray.add(relation);
						}
					}
				
					// now add this entity along with it's relation set into entityToRelationsMap by making some checks
					if(entityToRelationsMap.containsKey(entity)){ 
						Set<String> relationsSet = entityToRelationsMap.get(entity);
						// aad each relation to relationsSet
						for(Object o2 : relationsArray){
							relationsSet.add((String)o2);
						} 
					}
					else{
						// if entity not present then create its relation set and then add it into map
						Set<String> relationsSet = new HashSet<>(); 
						// add each relation to relationsSet
						for(Object o2 : relationsArray){
							relationsSet.add((String)o2); 
						}
						
						// now add the entity with it's relations set
						entityToRelationsMap.put(entity, relationsSet); 
					}				
				}
			} 
			//System.out.println(entityToRelationsMap);
			
			// now associate each entity with it's original text in the submitted content
			for(Iterator<String> it1 = entityToRelationsMap.keySet().iterator(); it1.hasNext();){
				String entity = it1.next(); 
				// get the relations set of the entity
				Set<String> relationsSet = entityToRelationsMap.get(entity); 
				// create a set for originalTexts of this entity
				Set<String> originalTextsSet = new HashSet<>();
				
				// now from each relation fetch the original text using idToJsonObjectMap
				for(Iterator<String> it2 = relationsSet.iterator(); it2.hasNext();){
					// fetch relation @id
					String relationId = it2.next(); 
					// Object to hold json-object
					Object o;
								
					// again it could be 'selected-text' or 'enhancer:selcted-text'
					if(idToJsonObject.get(relationId).containsKey("enhancer:selected-text")){
						o = JSONValue.parse(idToJsonObject.get(relationId).get("enhancer:selected-text").toString());
					}
					else{
						o = JSONValue.parse(idToJsonObject.get(relationId).get("selected-text").toString());
					}

					// get the 'selected-text' or 'enhancer:selected-text' json object
					JSONObject selectedTextJsonObject = (JSONObject)o;
					
					// get the value of @value key which is the original-text
					String originalText = selectedTextJsonObject.get("@value").toString();
					
					// now add this original-text to originalTextSet of this entity
					originalTextsSet.add(originalText);
				}
				
				// all original-texts of this entity fetched, so add this entity along with its relationsSet to entityToOriginalTextMap
				entityToOriginalTextMap.put(entity, originalTextsSet);
			}
		}
		
		return entityToOriginalTextMap;		
	}
	
	// for unit testing 
	public static void main(String[] args){
		Map<String, Set<String>> entityToOriginalTextMap=StanbolCaller.getEntities("BEIJING/MUMBAI (Reuters) - Nissan Motor Co takes the veil off the first car in its resurrected Datsun brand in New Delhi on Monday - a sub-400,000-rupee ($6,700) hatchback that is part of a foray by the Japanese auto maker into cheap cars for emerging markets.");
		
		for(Iterator<String> it1 = entityToOriginalTextMap.keySet().iterator(); it1.hasNext();){
			String entity = it1.next();
			
			System.out.println("Entity: "+ entity);
			
			Set<String> originalTextSet = entityToOriginalTextMap.get(entity);
			System.out.println(originalTextSet);
			System.out.println();
			System.out.println();
		}
	}
}
