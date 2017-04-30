import PropTypes from 'prop-types'

class ChartControls extends React.Component {
  onPercentCutoffChange(event) {
    this.props.onPercentCutoffChange(event.target.value)
  }

  render() {
    const { percentCutoff } = this.props

    return (
      <div className="artist-list-controls has-text-centered">
        <label htmlFor="percent-slider">Percent cutoff:</label>
        <input
          id="percent-slider"
          type="range"
          min="0"
          max="100"
          step="1"
          className="slider"
          value={percentCutoff}
          onChange={e => this.onPercentCutoffChange(e)}
        />
        <span className="percent-cutoff">
          {percentCutoff}%
        </span>
      </div>
    )
  }
}

ChartControls.propTypes = {
  percentCutoff: PropTypes.number.isRequired,
  onPercentCutoffChange: PropTypes.func.isRequired
}

export default ChartControls
