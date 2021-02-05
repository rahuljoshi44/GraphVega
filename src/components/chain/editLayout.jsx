import React, { Component } from 'react';
import EditLayoutModal from './editLayoutModal';

class EditLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layoutOptions: [
        "change",
        "change_percentage",
        "open",
        "high",
        "volume",
        "prevclose",
        "open_interest",
        "average_volume"
      ],
      layout: ["bid", "ask", "last"],
      tempLayout: [],
      tempLayoutOptions: [],
    };
  }
  componentDidMount() {
    const tempLayout = [...this.state.layout];
    const tempLayoutOptions = [...this.state.layoutOptions];
    this.setState({tempLayout, tempLayoutOptions});
  }
  
  handleAddLayoutItem = i => {
    const tempLayout = [...this.state.tempLayout];
    const tempLayoutOptions = [...this.state.tempLayoutOptions];
    tempLayout.push(this.state.tempLayoutOptions[i]);
    tempLayoutOptions.splice(i, 1);
    this.setState({ tempLayoutOptions, tempLayout });
  };

  handleRemoveLayoutItem = i => {
    const tempLayout = [...this.state.tempLayout];
    const tempLayoutOptions = [...this.state.tempLayoutOptions];
    tempLayoutOptions.push(this.state.tempLayout[i]);
    tempLayout.splice(i, 1); // removes item
    this.setState({ tempLayoutOptions, tempLayout });
  };

  handleMoveUp = i => {
    if (i > 0) {
      const tempLayout = [...this.state.tempLayout];
      const temp = tempLayout[i - 1];
      tempLayout[i - 1] = tempLayout[i];
      tempLayout[i] = temp;
      this.setState({ tempLayout });
    }
  };

  handleMoveDown = i => {
    if (i < this.state.tempLayout.length - 1) {
      const tempLayout = [...this.state.tempLayout];
      const temp = tempLayout[i + 1];
      tempLayout[i + 1] = tempLayout[i];
      tempLayout[i] = temp;
      this.setState({ tempLayout });
    }
  };

  handleSaveLayout = () => {
    const layout = [...this.state.tempLayout];
    const layoutOptions = [...this.state.tempLayoutOptions];
    this.setState({ layout, layoutOptions });
    this.props.onLayoutChange(layout);
  };

  handleClose = () => {
    const tempLayout = [...this.state.layout];
    const tempLayoutOptions = [...this.state.layoutOptions];
    this.setState({ tempLayout, tempLayoutOptions });
  };
  
  render() {
    return (
      <EditLayoutModal
        layout={this.state.tempLayout}
        layoutOptions={this.state.tempLayoutOptions}
        onAddLayoutItem={this.handleAddLayoutItem}
        onRemoveLayoutItem={this.handleRemoveLayoutItem}
        onSaveLayout={this.handleSaveLayout}
        onClose={this.handleClose}
        onMoveUp={this.handleMoveUp}
        onMoveDown={this.handleMoveDown}
      />
    )
  }
}

export default EditLayout;