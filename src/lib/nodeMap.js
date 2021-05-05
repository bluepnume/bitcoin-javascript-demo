import {
  faAtom,
  faBolt,
  faCode,
  faGhost,
  faRocket,
} from '@fortawesome/free-solid-svg-icons';

const propsArr = [
  {
    color: '#FF47A9',
    icon: faAtom,
  },
  {
    color: '#FB8500',
    icon: faBolt,
  },
  {
    color: '#00E9B0',
    icon: faCode,
  },
  {
    color: '#DC5CFF',
    icon: faGhost,
  },
  {
    color: '#FFB703',
    icon: faRocket,
  },
];

const idToProps = {};

export const mapIdToProps = (id) => {
  if (idToProps[id]) {
    return idToProps[id];
  } else {
    idToProps[id] = propsArr.pop();
    return idToProps[id];
  }
};