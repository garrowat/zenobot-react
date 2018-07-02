import React from 'react';
import PropTypes from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import { CircularProgress } from '@material-ui/core';

const apiUrl = `${process.env.REACT_APP_API_URL}`;

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
  proverb: {
    marginTop: theme.spacing.unit * 6,
    padding: theme.spacing.unit * 3,
    fontSize: '2em',
  },
  ul: {
    listStyleType: 'none',
    padding: 0,
  },
  historyPanel: {
    margin: 'auto',
    textAlign: 'center',
  },
});

class Index extends React.Component {
  state = {
    input: '',
    proverb: '',
    lastTenProverbs: [],
    isLoading: false,
  };

  handleFieldChange = (e) => {
    const input = e.target.value;
    this.setState({ input });
    console.log(this.state);
  }

  handleSubmit = (e, input) => {
    if (input) this.getProverb(input);
    console.log('getting proverb for: ', input)
    e.preventDefault();
  }
  getProverb = (input) => {
    let state = {...this.state};
    
    const lastTenProverbsUpdate = (proverb) => {
      // Maintain a list of only the last ten proverbs for this session
      let list = state.lastTenProverbs;
      list.length < 10
      ? state.lastTenProverbs.unshift(proverb)
      : state.lastTenProverbs.pop() && state.lastTenProverbs.unshift(proverb)
    };

    let isLoading = true;
    this.setState({ isLoading });

    console.log(apiUrl);
    try { 
      fetch(`${apiUrl}/${input}`)
      .then( (response) => {
        // Turn on loading
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong, can't generate proverb.")
        }
      })
      .then( result => {
        isLoading = false;
        const proverb = result.proverb;
        lastTenProverbsUpdate(proverb);
        this.setState({ proverb, isLoading });
      })
    }
    catch(error) {
      console.log(error)
    }
  }

  render() {
    const { classes } = this.props;
    const { proverb, lastTenProverbs, isLoading, input } = this.state;

    return (
      <div className={classes.root}>
        <Hidden smDown>
          <Typography variant="display4">
            ZenoBot
          </Typography>
        </Hidden>
        <Hidden mdUp>
          <Typography variant="display3">
            ZenoBot
          </Typography>
        </Hidden>
        <div className={classes.description}>
          <Typography variant="body1" style={{ fontFamily: "vt323", fontSize: "1.5em"}}>
            What troubles you, friend?
          </Typography>
          <form onSubmit={(e) => this.handleSubmit(e, input)}>
            <TextField 
            autoFocus={true}
            value={input || ''}
            onChange={(e) => this.handleFieldChange(e)}
            onBlur={(e) => this.handleSubmit(e, input)}
            />
          </form>
        </div>
        <Paper className={proverb}>
          {
            isLoading
            ? <CircularProgress />
            : <Typography 
            style={{ 
              fontFamily: "vt323", 
              fontSize: "150%"
            }} 
            variant='subheading'
            paragraph={true}>
              {proverb}
            </Typography>
          }
        </Paper>
        <ExpansionPanel className={classes.historyPanel}>
          <ExpansionPanelSummary className={classes.historyPanel} expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" color="textSecondary">
              Show last 10 proverbs
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <ul className={classes.ul}>
              {
                !proverb
                ? ''
                : lastTenProverbs.map((currentProverb, index) => 
                  <li key={JSON.stringify(index + currentProverb[1])}> 
                      <Typography paragraph={true} className={classes.historyDesc}>
                        {currentProverb}
                      </Typography>
                  </li>                
                )
                
              }
            </ul>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
