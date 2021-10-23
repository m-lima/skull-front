import React, { Component, Fragment } from 'react';
import './css/Grid.css';

import {
  Skull,
  Quick,
  Occurrence,
  ProtoOccurrence,
  SkullId,
} from '../model/Skull';
import Icon from './Icon';
import EditOccurrence from './EditOccurrence';

interface IProps {
  skulls: Skull[];
  quicks: Quick[];
  occurrences: Occurrence[];
  push: (occurrence: ProtoOccurrence, skull: Skull) => void;
}

interface IState {
  selected?: ProtoOccurrence;
}

class SkullAmount {
  skull: number;
  amount: number;

  constructor(skull: SkullId, amount: number) {
    this.skull = skull.index;
    this.amount = amount;
  }
}

const THREE_QUARTERS = 0.75;

const idForQuick = (
  skullAmounts: Map<number, number>,
  quick: Quick,
  skull: Skull
) => {
  if (skull.limit && skullAmounts.has(quick.skull.index)) {
    const skullAmount = skullAmounts.get(quick.skull.index)! + quick.amount;
    if (skullAmount > skull.limit * THREE_QUARTERS) {
      return 'Grid-button-over-limit';
    } else if (skullAmount > skull.limit * 0.8 * THREE_QUARTERS) {
      return 'Grid-button-near-limit';
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
};

export default class Grid extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { selected: undefined };
    this.accept = this.accept.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  showConfirmation(quick: Quick) {
    this.setState({
      selected: {
        skull: quick.skull,
        amount: quick.amount,
        millis: new Date().getTime(),
      },
    });
  }

  accept(occurrence: ProtoOccurrence) {
    this.setState({ selected: undefined });
    this.props.push(occurrence, occurrence.skull.get(this.props.skulls));
  }

  cancel() {
    this.setState({ selected: undefined });
  }

  buildSkullButton = (
    skullAmounts: Map<number, number>,
    quick: Quick,
    skull: Skull,
    index?: number
  ) => (
    <div
      key={index}
      className='Grid-button'
      title={
        'Skull: ' +
        skull.name +
        '\nAmount: ' +
        quick.amount +
        (skull.limit ? '\nLimit: ' + skull.limit : '')
      }
      style={{ background: skull.color }}
      onClick={() => this.showConfirmation(quick)}
    >
      <Icon icon={skull.icon} />
      <div
        className='Grid-button-amount'
        id={idForQuick(skullAmounts, quick, skull)}
      >
        {quick.amount}
      </div>
    </div>
  );

  render() {
    const threeQuartersOfADayAgo =
      new Date().getTime() - THREE_QUARTERS * 24 * 60 * 60 * 1000;
    const skullAmounts = this.props.occurrences
      .filter(o => o.millis > threeQuartersOfADayAgo)
      .map(o => new SkullAmount(o.skull, o.amount))
      .reduce((acc, curr) => {
        let amount = acc.get(curr.skull);
        if (amount) {
          amount += curr.amount;
        } else {
          amount = curr.amount;
        }
        acc.set(curr.skull, amount);
        return acc;
      }, new Map<number, number>());

    return (
      <Fragment>
        <div className='Grid'>
          {this.props.skulls &&
            this.props.quicks &&
            this.props.quicks.map((q, i) =>
              this.buildSkullButton(
                skullAmounts,
                q,
                q.skull.get(this.props.skulls),
                i
              )
            )}
        </div>
        {this.state.selected && (
          <EditOccurrence
            skulls={this.props.skulls}
            value={this.state.selected!}
            onAccept={this.accept}
            onCancel={this.cancel}
          />
        )}
      </Fragment>
    );
  }
}
