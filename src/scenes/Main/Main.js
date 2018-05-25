import React from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Layout from '../../components/Layout';
import DataLoader from '../../components/DataLoader';

const Main = ({ mainstore }) => {
	return (
		<ContainerLayout alwaysLoad footer>
			<Section>
				<DataLoader />
			</Section>
		</ContainerLayout>
	);
};

Main.propTypes = {
	mainstore: PropTypes.object.isRequired
};

export default inject('mainstore')(observer(Main));

const ContainerLayout = styled(Layout)`
	overflow: hidden;
	width: 100vw;
	height: 100vh;
`;

const Section = styled.div`
	display: flex;
	overflow: hidden;
	justify-content: center;
	align-items: center;
	width: 100vw;
	height: 100vh;
	background-color: white;
	transition: all ease 0.33s;
	will-change: width;
`;
