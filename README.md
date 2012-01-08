# CONCEPT

Library to syncronize JSON datasets using timestamps to automatically override conflicting data. It always assumes that the relevant data belonging to someone or update by someone is the most recent.
This will allow for simple apps from multiple different sources to work independently and still be able to syncronize at the same time without complex logic or time consuming operations.
Time is kept at key/value level so that each item is synced independently.

# SCENARIO

Imagine a room with 4 entry points. At each entry point there is a person with an app validating who is allowed to enter the room. A regular app will validate everything with a central server so that every entry point seems the 
same data. However, if the connections fails or the server goes down, our access control app is rendered unusable. Chaos ensues. An app using json-timesync can be coded to work independently of a central server by keeping a 
copy of the relevant data and syncronizing everything once connection/server is restored. Since it overrides based on time, it *should* never fail or create a conflict. A server will be a simple relay for the sync or it can have 
other logic for dealing with the data.

#CRUD

	* CREATE
	During a downstream of data to sync, new items can be added or discarded per configuration. Usually there is no problem with adding new pieces of data. The only problem occurs when a piece of data has an unique id 
	that is relevant for a central server/application. It is recommended for data with unique ids to be created centrally. However, json-timesync will try to deal with this issue by detecting ids fields and indexing those 
	values with a per instance unique identifier. Concept in progress...
	
	* READ
	No secret here. Just use the data as needed.
	
	* UPDATE
	This is the heart of this class. A json-timesync object always carries the time of the last update no matter where it is done. It assumes the most recent value is the most relevant.
	
	* DELETE
	If a downstream sync has data missing from your current dataset, it will be remove from it. This can be disabled. For example, you might have an instance of the app running on a central server and that copy is the only 
	one allowed to delete data. If disabled, data that has been removed might become available again if the the upstream is active for syncing other apps. 