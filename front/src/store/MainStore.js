import { observable, action, autorun } from 'mobx';
import crypto from 'crypto';

const CORPORAMA_STORE = 'CORPORAMA_STORE';
const SERVER_HEALTH_ROUTE = 'http://localhost:8000/healthcheck';
const SERVER_DATA_ROUTE = 'http://localhost:8000/getresults';

export default class MainStore {
	@observable errors = [];
	@observable flash = false;
	@observable errorCount = 3;
	@observable isErrorsVisible = false;
	@observable isConnectedServer = false;
	@observable morethantwicecount = 0;
	@observable stilluniquecount = 0;
	@observable isfinished = false;

	/* actions */
	@action
	addError(message, source) {
		this.errors.push({
			key: crypto.randomBytes(20).toString('hex'),
			message: message,
			source: source
		});

		this.flash = true;
	}

	@action
	toggleErrorsView() {
		this.isErrorsVisible = !this.isErrorsVisible;
	}

	@action
	removeError(id) {
		this.errors = this.errors.filter(err => err.key !== id);
	}

	@action
	async checkServer() {
		// const myHeaders = new Headers({
		// 	'Content-Type': 'application/json',
		// 	Accept: 'application/json',
		// 	'Access-Control-Allow-Origin': '*',
		// 	'Access-Control-Allow-Credentials': 'true'
		// });

		const request = new Request(SERVER_HEALTH_ROUTE, {
			// headers: myHeaders,
			method: 'GET'
		});

		try {
			const res = await fetch(request);
			//console.log(res);

			const resStatusCode = res.status;
			const resStatusText = res.statusText;
			const resData = await res.json();

			if (resStatusCode === 201) {
				this.isConnectedServer = true;
				console.log(resData.data.status);
			} else {
				this.addError(
					`ServerError/ Status : ${resStatusCode}`,
					`Error: ${resStatusText}`
				);
				this.isConnectedServer = false;
			}
		} catch (e) {
			console.log('Server down');
			this.isConnectedServer = false;
		}
	}

	@action
	async fetchData() {
		this.checkServer();

		this.stillunique = [];
		this.morethantwice = [];

		this.isfinished = false;
		this.finishedLoading = false;
		const request = new Request(SERVER_DATA_ROUTE, {
			// headers: myHeaders,
			method: 'GET'
		});

		try {
			const res = await fetch(request);
			const resStatusCode = res.status;
			const resStatusText = res.statusText;
			const resData = await res.json();

			if (resStatusCode === 200) {
				this.morethantwicecount = resData.data.morethantwicecount;
				this.stilluniquecount = resData.data.stilluniquecount;
				this.isfinished = true;
			} else {
				this.addError(
					`ServerError/ Status : ${resData.data.error}`,
					`Error: ${resStatusText}`
				);
			}
		} catch (e) {
			this.addError(
				'checkServer : / mainstore ' + e,
				'Error: taking too long for response.'
			);
		}
	}

	/* other */
	fromJSON(jsonData) {
		const parsed = JSON.parse(jsonData);

		const setIfDefined = key => {
			typeof parsed[key] !== 'undefined'
				? (this[key] = parsed[key])
				: this.addError('Error: undefined key', 'fromJSON : / mainuistore');
		};

		setIfDefined('errors');
	}

	toObject() {
		return {
			errors: this.errors || []
		};
	}

	toJSON() {
		return JSON.stringify(this.toObject());
	}

	constructor() {
		this.toggleErrorsView = this.toggleErrorsView.bind(this);
		this.removeError = this.removeError.bind(this);
		this.checkServer = this.checkServer.bind(this);
		this.fetchData = this.fetchData.bind(this);
		this.addError = this.addError.bind(this);
		this.toObject = this.toObject.bind(this);
		this.fromJSON = this.fromJSON.bind(this);
		this.toJSON = this.toJSON.bind(this);

		try {
			const data = localStorage.getItem(CORPORAMA_STORE);
			if (data) this.fromJSON(data);
		} catch (e) {
			this.addError('Error: localStorage getItem', e);
		}

		this.checkServer();

		autorun(() => {
			try {
				localStorage.setItem(CORPORAMA_STORE, this.toJSON());
			} catch (e) {
				this.addError('Error: localStorage setItem', e);
			}
		});

		autorun(() => {
			this.errorCount = this.errors.length;
		});

		autorun(() => {
			this.flash &&
				setTimeout(() => {
					this.flash = false;
				}, 110);
		});

		autorun(() => {
			setInterval(() => {
				this.checkServer();
			}, 5000);
		});
	}
}
