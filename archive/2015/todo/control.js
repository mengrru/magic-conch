// var List = require('./list.js');

function Todo() {
	this.dataOrigin = '';
	this.dataJSON = '';
	
	this.remaining = new List();
	this.done = new List();

	this.model = '<li class="( class_li )"><input type="checkbox" ( checked )><label>( content )</label></li>';
	this.r_config = {
		class_li: '',
		checked: '',
		content: ''
	};
	this.d_config = {
		class_li: 'del-li',
		checked: 'checked',
		content: ''
	};

	this.listObj = document.getElementById('task-list');
}

Todo.prototype = {
	constructor: Todo,
	init: function(listCallback) {
		if(this.readData('todo')) {
			this.listCallback = listCallback;

			this.initData(this.dataJSON.remaining, this.remaining);
			this.initData(this.dataJSON.done, this.done);
			this.render();
		}
	},
	render: function() {
		var _this = this;

		this.remaining.every(function() {
			_this.r_config.content = this.getEle();
			_this.listObj.innerHTML += modelPre(_this.model, _this.r_config);
		});

		this.done.every(function() {
			_this.d_config.content = this.getEle();
			_this.listObj.innerHTML += modelPre(_this.model, _this.d_config);
		});

		this.initClickEvent();
	},
	initClickEvent: function() {
		var liList = this.listObj.getElementsByTagName('li');
		var _this = this;

		for(var i=0; i<liList.length; i++) {
			var inputObj = liList[i].getElementsByTagName('input')[0];

			inputObj.addEventListener('click', function() {
				var content = this.parentElement.getElementsByTagName('label')[0].innerHTML;

				if(_this.updateList(content, this.checked)) {
					_this.updateView.call(this);

					_this.listCallback.call(_this);
				}
			});
		}
	},
	updateView: function() {
		if(this.checked) {
			addClass(this.parentElement, 'del-li');
		} else {
			removeClass(this.parentElement, 'del-li')					
		}
	},
	updateList: function(content, is) {
		if(is) {
			this.remaining.remove(content);
			this.done.append(content);
			return true;
		} else {
			this.remaining.append(content);
			this.done.remove(content);
			return true;
		}
	},
	addTask: function(content, callback) {
		this.remaining.insert(content, 0);
		this.r_config.content = content;

		this.r_config.content = content;
		this.listObj.innerHTML = modelPre(this.model, this.r_config) + this.listObj.innerHTML;	

		this.initClickEvent();

		if(callback) {
			callback.call(this)
		}
	},
	clear: function() {
		this.done.clear();
		var liList = this.listObj.childNodes,
			delArr = [];

		for(var i=0; i<liList.length; i++){
			if(liList[i].className.indexOf('del-li') != -1){
				delArr.push(liList[i]);
			}
		}
		for(i=0; i<delArr.length; i++){
			this.listObj.removeChild(delArr[i]);
		}
	},
	initData: function(data, obj) {
		for(var i=0; i<data.length; i++) {
			obj.append(data[i]);
		}
	},
	packData: function() {
		var newJSON = {
			"remaining": this.remaining.toString(),
			"done": this.done.toString()
		};
		this.dataOrigin = JSON.stringify(newJSON);
	},
	readData: function(attrName) {
		if(window.localStorage) {
			this.dataOrigin = window.localStorage[attrName];
			if(this.dataOrigin) {
				this.dataJSON = JSON.parse(this.dataOrigin);
				return true;
			}
			return false;
		}
		this.error();
	},
	writeData: function(attrName) {
		this.packData();
		if(window.localStorage) {
			window.localStorage[attrName] = this.dataOrigin;
		}
	}
}

function modelPre(model, config) {
	var re_name = /[\(\s*]\w+[\s*\)]/g,
		re_sign = /\(\s*\w+\s*\)/g;

	var arr_name = model.match(re_name),
		arr_sign = model.match(re_sign);

	for(var i=0; i<arr_name.length; i++) {
		arr_name[i] = arr_name[i].replace(/\s*/g, '');
		model = model.replace(arr_sign[i], config[arr_name[i]]);
	}
	return model;
}

function removeClass(elem, oldClass){
	var classList = elem.className.split(' ');
	for(var i=0; i<classList.length; i++){
		if(classList[i].indexOf(oldClass) != -1){
			classList.splice(i, 1);
		}
	}
	elem.className = classList.join(' ');
	//console.log(classList);
}

function addClass(elem, newClass){
	if(elem.className.indexOf(newClass) == -1){
		elem.className += (' ' + newClass);
	}
}

function setClass(elem, newClass){
	elem.setAttribute('class', newClass);
}

