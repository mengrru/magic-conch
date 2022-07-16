function List() {
	this.listSize = 0;
	this.pos = 0;
	this.dataStore = [];
	this.tempIndex = 0;
	this.tempContent = 0;
}
List.prototype = {
	constructor: List,
	append: function(element) {
		this.dataStore[this.listSize++] = element;
	},
	find: function(element) {
		for(var i=0; i<this.dataStore.length; i++) {
			if(this.dataStore[i] == element) {
				return i;
			}
		}
		return -1;
	},
	remove: function(element) {
		this.tempIndex = this.find(element);

		if(this.tempIndex > -1) {
			this.tempContent = this.dataStore.splice(this.tempIndex, 1);
			this.listSize--;

			return true;
		}
		return false;
	},
	toString: function() {
		return this.dataStore;
	},
	insert: function(element, insertPos) {

		if(insertPos > -1) {
			this.dataStore.splice(insertPos, 0, element);
			this.listSize++;

			return true;
		}
		return false;
	},
	clear: function() {
		delete this.dataStore;
		this.dataStore = [];
		this.listSize = this.pos = 0;
	},
	contains: function(element) {
		if(this.find(element) != -1) {
			return true;
		}

		return false;
	},
	length: function() {
		return this.listSize;
	},
	front: function() {
		this.pos = 0;
	},
	end: function() {
		this.pos = this.listSize - 1;
	},
	prev: function() {
		if(this.pos > 0) {
			this.pos--;
		}
	},
	next: function() {
		if(this.pos < this.listSize) {
			this.pos++;
		}
	},
	currPos: function() {
		return this.pos;
	},
	moveTo: function(position) {
		this.pos = position;
	},
	getEle: function() {
		return this.dataStore[this.pos];
	},
	every: function(fun) {
		for(this.front(); this.currPos() < this.length(); this.next() ) {
			fun.call(this);
		}
	}
}

// module.exports = List;
