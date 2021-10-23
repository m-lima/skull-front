import React from 'react';
import { Link } from 'react-router-dom';
import './css/Footer.css';

import * as Config from '../model/Config';
import Icon from './Icon';

interface IProps {
  path: string;
}

const Footer = (props: IProps) => (
  <div className='Footer'>
    <div className='Footer-container'>
      <a href={Config.Endpoint.skull} title='Download JSON'>
        <Icon icon='fas fa-file-download' />
      </a>
      <Link
        to={Config.Path.grid}
        title='Quick values'
        id={props.path === Config.Path.grid ? 'selected' : undefined}
      >
        <Icon icon='fas fa-th-large' />
      </Link>
      <Link
        to={Config.Path.summary}
        title='Summary'
        id={props.path === Config.Path.summary ? 'selected' : undefined}
      >
        <Icon icon='fas fa-th-list' />
      </Link>
      <Link
        to={Config.Path.chart}
        title='Chart'
        id={props.path === Config.Path.chart ? 'selected' : undefined}
      >
        <Icon icon='fas fa-chart-line' />
      </Link>
    </div>
  </div>
);

export default Footer;
