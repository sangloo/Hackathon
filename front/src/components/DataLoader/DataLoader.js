import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Flex } from 'reflexbox';
import styled from 'styled-components';

const DataLoader = ({ mainstore }) => {
	let {
		fetchData,
		morethantwicecount,
		stilluniquecount,
		isfinished
	} = mainstore;

	const handleClickButton = () => fetchData();

	return (
		<Flex auto column align="center" justify="center">
			<LoginButton onClick={handleClickButton} />

			<div>
				<ReceivedDataHeader>
					<UniqueSIRENS>
						<Boldp>Unique SIRENS: </Boldp>
					</UniqueSIRENS>
					<MoreThanTwiceSIRENS>
						<Boldp>More than twice SIRENS: </Boldp>
					</MoreThanTwiceSIRENS>
				</ReceivedDataHeader>
				<ReceivedData>
					<UniqueSIRENS>
						<ul>{stilluniquecount || 0}</ul>
					</UniqueSIRENS>
					<MoreThanTwiceSIRENS>
						<p>{morethantwicecount || 0}</p>
					</MoreThanTwiceSIRENS>
				</ReceivedData>
			</div>
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

const ReceivedDataHeader = styled.div`
	width: 60%;
	min-width: 600px;
	overflow: hidden;
	margin-top: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ReceivedData = styled.div`
	width: 60%;
	min-width: 600px;
	overflow: hidden;
	min-height: 10px;
	max-height: 500px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const UniqueSIRENS = styled.div`
	width: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow-y: scroll;
`;

const MoreThanTwiceSIRENS = styled.div`
	width: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow-y: scroll;
`;

const LoginButton = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-content: center;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.33s cubic-bezier(0.64, 0.57, 0.67, 1.53);

	::after {
		position: absolute;
		content: 'Start loading data';
		font-weight: 300;
		font-size: 1em;
		transition: all 0.33s cubic-bezier(0.64, 0.57, 0.67, 1.53);
		border: 1px solid black;
		border-radius: 2px;
		max-width: 350px;
		width: calc(100% - 2em);
		height: 48px;
		letter-spacing: 0.2em;
		display: flex;
		align-content: center;
		align-items: center;
		justify-content: center;
		color: black;
		will-change: letter-spacing, color, width: height, border;
	}
	:hover::after {
		letter-spacing: 0.4em;
		color: white;
		max-width: 380px;
		width: calc(100% - 2em);
		border: 1px solid rgba(0, 0, 0, 0);
		height: 58px;
		will-change: letter-spacing, color, width: height, border;
		transition: all 0.3s ease-in-out;
	}

	::before {
		position: absolute;
		content: '';
		transition: all 0.3s ease-in-out;
		background-color: black;
		max-width: 350px;
		width: 0px;
		height: 0px;
		border-radius: 2px;
		display: flex;
		align-content: center;
		align-items: center;
		justify-content: center;
		will-change: width, height;
	}
	:hover::before {
		width: calc(100% - 2em);
		height: 48px;
		will-change: width, height;
		transition: width 0.33s cubic-bezier(0.64, 0.57, 0.67, 1.53), height 0.33s cubic-bezier(0.64, 0.57, 0.67, 1.53);
	}
`;
