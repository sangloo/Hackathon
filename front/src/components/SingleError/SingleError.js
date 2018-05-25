import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SingleError = ({ message, source, uniqueid, mainstore }) => {
	const { removeError, errorCount, toggleErrorsView } = mainstore;

	const removeThisError = () => {
		if (errorCount === 0) {
			toggleErrorsView();
		}

		removeError(uniqueid);
	};

	return (
		<ErrorContainer
			uniqueid={uniqueid}
			auto
			column
			align="center"
			justify="center">
			<CloseContainer>
				<CloseButton onClick={removeThisError}>X</CloseButton>
			</CloseContainer>
			<SourceContainer>{source}</SourceContainer>
			<MessageContainer>{message}</MessageContainer>
		</ErrorContainer>
	);
};

SingleError.propTypes = {
	message: PropTypes.string.isRequired,
	source: PropTypes.string.isRequired,
	uniqueid: PropTypes.string.isRequired,
	mainstore: PropTypes.object.isRequired
};

export default inject('mainstore')(observer(SingleError));

const ErrorContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	width: 350px;
	min-height: 80px;
	background-color: white;
	transition: transform ease 0.33s;
	margin: 0;
	padding: 0;
	z-index: 2;
	will-change: transform;

	:hover {
		transition: transform ease 0.33s;
		transform: translate(3px, -10px);
		will-change: transform;
	}

	::after {
		z-index: -1;
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: white;
		transition: transform ease 0.33s;
	}

	::before {
		z-index: -2;
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: black;
		transition: transform ease 0.33s;
		will-change: transform;
	}

	:hover::before {
		transition: transform ease 0.33s;
		transform: translate(-3px, 10px);
		will-change: transform;
	}
`;

const SourceContainer = styled.p`
	text-align: left;
	padding: 0;
	padding-left: 10px;
	padding-right: 10px;
	width: 100%;
	margin: 0px;
	margin-top: 0px;
	margin-bottom: 5px;
	font-weight: 500;
	color: black;

	::before {
		content: '@ ';
	}
`;

const CloseContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	padding: 0;
	padding-left: 10px;
	padding-right: 10px;
	width: 100%;
	height: 20px;
	margin: 0;
	margin-top: 0px;
	font-weight: 500;
	color: black;
`;

const CloseButton = styled.p`
	text-align: center;
	padding: 0;
	margin: 0px;
	width: 15px;
	font-weight: 500;
	cursor: pointer;
	width: 20px;
	height: 20px;
	:hover {
		border-radius: 50%;
		color: red;
	}
`;

const MessageContainer = styled.p`
	text-align: left;
	padding: 0;
	padding-left: 10px;
	padding-right: 10px;
	width: 100%;
	margin: 0px;
	margin-top: 0px;
	margin-bottom: 5px;
	font-weight: 200;
	color: '#FF9F39';
`;
