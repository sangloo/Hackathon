import React from 'react';
import { Flex } from 'reflexbox';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';

import Errorutil from '../Errorutil';

const Layout = ({ mainstore, children }) => {
	const { errorCount, toggleErrorsView, flash } = mainstore;

	const toggleErrors = () => toggleErrorsView();

	return (
		<LayoutSection color={'white'} oppositecolor={'black'} auto column>
			<Flex auto>{children}</Flex>

			<FooterContainer>
				<Sectioncontainer>
					<FooterSpan />
				</Sectioncontainer>
				<ContainerFuncs>
					<ErrorContainerShowHide animate={flash} onClick={toggleErrors}>
						<ErrorContainerText>
							{errorCount === 0
								? 'no errors'
								: `there are ${errorCount} errors`}
						</ErrorContainerText>
					</ErrorContainerShowHide>
				</ContainerFuncs>
				<Errorutil />
			</FooterContainer>
		</LayoutSection>
	);
};

Layout.propTypes = {
	children: PropTypes.node.isRequired,
	mainstore: PropTypes.object.isRequired
};

export default inject('mainstore')(observer(Layout));

const LayoutSection = styled(Flex)`
	background-color: white;
`;

const FooterContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: relative;
	height: 40px;
	padding: 0px 10px;
	flex-shrink: 0;
	border-top: 1px solid black;
	color: black;
`;

const ContainerFuncs = styled.div`
	display: flex;
	height: 100%;
	justify-content: center;
	align-items: center;
	margin-left: 15;
	margin-right: 15;
`;

const ErrorContainerShowHide = styled.div`
	overflow: hidden;
	position: relative;
	height: 20px;
	color: black;
	margin-left: 15px;
	margin-right: 35px;
	padding-left: 5px;
	padding-right: 5px;
	cursor: pointer;
	transition: background-color ease 0.11s;

	${props =>
		props.animate &&
		css`
			background-color: red;
			transition: background-color ease 0.11s;
		`};
`;

const translateText = keyframes`
  from {
    transform: translate(120%, 0px);
  }

  to {
    transform: translate(-120%, 0px);
  }
`;

const ErrorContainerText = styled.p`
	margin: 0;
	padding: 0;
	will-change: transform;
	transition: transform ease 0.33s;
	animation: ${translateText} 3s linear infinite;
`;

const Sectioncontainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	align-content: center;
`;

const FooterSpan = styled.span`
	color: ${props => props.oppositecolor};
	text-decoration: none;
	display: flex;
	justify-content: center;
	align-items: center;

	&:hover {
		color: darkGray;
		cursor: pointer;
	}
`;
