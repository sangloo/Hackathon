import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Flex } from 'reflexbox';
import styled from 'styled-components';

const DataLoader = ({ mainstore }) => {
	let { errorCount } = mainstore;
	console.log(errorCount);

	return (
		<Flex auto column align="center" justify="center">
			<Boldp>Hello World!</Boldp>
		</Flex>
	);
};

DataLoader.propTypes = {
	mainstore: PropTypes.object.isRequired
};

export default inject('mainstore')(observer(DataLoader));

const Boldp = styled.p`
	font-weight: 700;
`;
