import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import { Flex } from 'reflexbox';

import stores from './store';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

render(
	<Flex auto>
		<Provider {...stores}>
			<App />
		</Provider>
	</Flex>,
	document.getElementById('root')
);
registerServiceWorker();
