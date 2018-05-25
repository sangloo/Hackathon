import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { Flex } from 'reflexbox';
import styled from 'styled-components';

import Main from './scenes/Main';

@inject('mainstore')
@observer
class App extends Component {
	render() {
		return (
			<IndexSection auto>
				<Main />
			</IndexSection>
		);
	}
}

App.propTypes = {
	mainstore: PropTypes.func
};

export default App;

const IndexSection = styled(Flex)`
	overflow: hidden;
	width: 100vw;
	height: 100vh;
`;
