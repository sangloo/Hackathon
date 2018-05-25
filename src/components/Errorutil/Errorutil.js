import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import crypto from 'crypto';

import SingleError from '../SingleError';

const Errorutil = ({ mainstore }) => {
	const { isErrorsVisible, errorCount, errors } = mainstore;

	const renderErrors = errors.map(err => (
		<SingleError
			key={crypto.randomBytes(40).toString('hex')}
			message={err.message}
			source={err.source}
			uniqueid={err.key}
		/>
	));

	return (
		<Container
			auto
			column
			align="center"
			justify="center"
			visible={isErrorsVisible}>
			{isErrorsVisible && errorCount > 0 ? (
				renderErrors
			) : (
				<SingleError
					message="There is no error"
					source="No/Error/..."
					uniqueid="1"
				/>
			)}
		</Container>
	);
};

Errorutil.propTypes = {
	mainstore: PropTypes.object.isRequired
};

export default inject('mainstore')(observer(Errorutil));

const Container = styled.div`
	overflow-y: scroll;
	position: absolute;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	width: 370px;
	max-height: 500px;
	margin: 0;
	padding: 0;
	bottom: -700px;
	padding-top: 30px;
	right: 20px;
	transition: bottom ease 0.66s;
	${props =>
		props.visible &&
		css`
			transition: bottom ease 0.66s;
			bottom: 41px;
		`};
`;
