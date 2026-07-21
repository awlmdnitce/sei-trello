import React from 'react';
import TrelloButton from 'view/components/TrelloButton';

import { faArchive } from '@fortawesome/free-solid-svg-icons';

class TrelloArchiveButton extends React.Component {
  onClick(e) {
    e.preventDefault();
    if (!this.props.onClick) return;
    if (this.props.isLoading) return;
    this.props.onClick(e);
  }

  render() {
    return (
      <TrelloButton
        title="Arquivar cartões de processos que não estão mais na sua caixa"
        icon={faArchive}
        onClick={this.onClick.bind(this)}
      ></TrelloButton>
    );
  }
}

export default TrelloArchiveButton;
