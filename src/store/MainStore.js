import { observable, action, autorun } from 'mobx';
import crypto from 'crypto';

const HACKATHON_STORE = 'HACKATHON_STORE';

export default class MainStore {
	@observable errors = [];
	@observable flash = false;
	@observable errorCount = 0;
	@observable isErrorsVisible = false;

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
		this.addError = this.addError.bind(this);
		this.toObject = this.toObject.bind(this);
		this.fromJSON = this.fromJSON.bind(this);
		this.toJSON = this.toJSON.bind(this);

		try {
			const data = localStorage.getItem(HACKATHON_STORE);
			if (data) this.fromJSON(data);
		} catch (e) {
			this.addError('Error: localStorage getItem', e);
		}

		autorun(() => {
			try {
				localStorage.setItem(HACKATHON_STORE, this.toJSON());
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
	}
}
