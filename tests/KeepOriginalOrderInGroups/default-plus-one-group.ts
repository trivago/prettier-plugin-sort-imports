import styles from '../src/styles/main.module.scss';
import { SIZE, THEMES } from '../src/components/website/vars';
import { titleize } from '../src/components/common/utils';
import PatternSection from '../src/components/website/components/pattern/PatternSection';
import PatternBlock from '../src/components/website/components/pattern/PatternBlock';
import * as React from 'react';
import PatternHeading from '../src/components/website/components/pattern/PatternHeading';
import cn from 'classnames';
import { select } from '@storybook/addon-knobs';