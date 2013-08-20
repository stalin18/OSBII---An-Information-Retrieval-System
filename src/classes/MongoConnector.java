package classes;

import java.net.UnknownHostException;

import com.mongodb.MongoClient;

public class MongoConnector {

	/**
	 * @param args
	 */
	private static String serverAddress = "localhost";       
	private static int port = 27017;
	
	// function to get the mongo client
	public static MongoClient getConnection() throws UnknownHostException{
		// connect to mongo client
		MongoClient mongoClient = new MongoClient(serverAddress, port);
		
		// return the mongo client
		return mongoClient;
	}
	
	// function to close mongo client 
	public static void closeConnection(MongoClient mongoClient){
		mongoClient.close();
	}
}
