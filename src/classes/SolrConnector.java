package classes;

import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.impl.HttpSolrServer;

public class SolrConnector {
	private static String url = "http://localhost:8983/solr";
	
	public static SolrServer getSolr(){
		// get the solr server instance
		SolrServer solr = new HttpSolrServer(url); 
		
		// return this solr server instance
		return solr;
	}
}
