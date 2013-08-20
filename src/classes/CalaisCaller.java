package classes;

import java.io.IOException;
import mx.bigdata.jcalais.CalaisClient;
import mx.bigdata.jcalais.CalaisObject;
import mx.bigdata.jcalais.CalaisResponse;
import mx.bigdata.jcalais.rest.CalaisRestClient;

public class CalaisCaller {
	// open calais authentication key
	private static String calaisKey="sj3p5ufbubuw9vn75qpuj5qy";
	
	public static String getMetaData(String content) throws IOException{
		
		// authentication to calais
		CalaisClient client = new CalaisRestClient(calaisKey);
		// send the content to analyze and get the response
		CalaisResponse calaisResponse = client.analyze(content);

		// resulting json string
		StringBuilder jsonResult = new StringBuilder();
		// separate strings for each type 
		StringBuilder topicsJson = new StringBuilder();
		StringBuilder socialTagsJson = new StringBuilder();
		StringBuilder entitiesJson = new StringBuilder();
		
		// start json
		jsonResult.append("{");
		
		// get each topic name and its score and put it json array
		topicsJson.append("\"topics\": [");		
		for(CalaisObject calaisTopic : calaisResponse.getTopics()){
			// get key and values and format them to fit in json format
			String key = calaisTopic.getField("categoryName").replaceAll("_", " ").replaceAll("\"", "\\\\\"").replaceAll("[\n\r]", " ");
			String value = Integer.toString((int)Math.ceil(Float.parseFloat(calaisTopic.getField("score"))*100))+"%";
			// store the key-value pair in topics array
			String topic = "{ \"categoryName\":\"" + key + "\" , \"score\":\"" + value +"\"},";
			topicsJson.append(topic);
		}		
		if(topicsJson.charAt(topicsJson.length()-1)==','){
			topicsJson.deleteCharAt(topicsJson.length()-1);
		}
		topicsJson.append("],");
		jsonResult.append(topicsJson);
		
		// get each social tag and its importance and put it json array
		socialTagsJson.append("\"socialTags\": [");		
		for(CalaisObject calaisSocialTag : calaisResponse.getSocialTags()){
			// get key and values and format them to fit in json format
			String key = calaisSocialTag.getField("name").replaceAll("_", " ").replaceAll("\"", "\\\\\"").replaceAll("[\n\r]", " ");
			String value = calaisSocialTag.getField("importance");
			// store the key-value pair in socialTags array
			String socialTag = "{ \"originalValue\":\"" + key + "\" , \"importance\":\"" + value + "\"},";
			socialTagsJson.append(socialTag);
		}
		if(socialTagsJson.charAt(socialTagsJson.length()-1)==','){
			socialTagsJson.deleteCharAt(socialTagsJson.length()-1);
		}
		
		socialTagsJson.append("],");
		jsonResult.append(socialTagsJson);
		
		// get each entity type and its name and put it json array
		entitiesJson.append("\"entities\": [");
		for(CalaisObject calaisEntity : calaisResponse.getEntities()){
			// get key and values and format them to fit in json format
			String key = calaisEntity.getField("_type").replaceAll("_", " ").replaceAll("[\n\r]", " ");
			String value = calaisEntity.getField("name").replaceAll("_", " ").replaceAll("[\n\r]", " ");
			// store the key-value pair in entities array
			String entity = "{ \"_type\":\"" + key + "\" , \"name\":\"" + value + "\"},";
			entitiesJson.append(entity);
		}
		if(entitiesJson.charAt(entitiesJson.length()-1)==','){
			entitiesJson.deleteCharAt(entitiesJson.length()-1);
		}
		entitiesJson.append("]");
		jsonResult.append(entitiesJson);
		
		// end json
		jsonResult.append("}");
				
		//System.out.println("From CalaisCaller: " + jsonResult);
		// return the json array in string format
		return jsonResult.toString();
	}
}
