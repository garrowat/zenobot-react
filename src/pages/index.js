import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CodeIcon from '@material-ui/icons/Code';
import InfoIcon from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import { CircularProgress } from '@material-ui/core';

import zenobot0 from '../images/zenobot0.png'
import zenobot1 from '../images/zenobot1.png'
import zenobot2 from '../images/zenobot2.png'

let apiUrl = `${process.env.REACT_APP_API_URL}`;

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 15,
  },
  homeLink: {
    position: 'absolute',
    left: 0,
    top: 0,
    margin: theme.spacing.unit,
    fontSize: '20%',
  },
  formControl: {
    margin: 'auto',
    marginBottom: theme.spacing.unit * 2,
  },
  projectLinks: {
    margin: 'auto',
  },
  popOver: {
    margin: theme.spacing.unit * 2,
    maxWidth: 300,
    height: 'auto',
  },
  botImageContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: 'auto',
    marginTop: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    maxWidth: '60px',
    height: 'auto',
    transition: 'all 0.5s ease-in-out',
  },
  botImage: {
    width: '100%',
    height: 'auto',
    filter: 'hue-rotate(0deg)',
    transition: 'all 0.5s ease-in-out',
  },
  proverbBox: {
    margin: theme.spacing.unit * 6,
    padding: theme.spacing.unit * 3,
    fontSize: '2em',
  },
  expansionPanel: {
    margin: theme.spacing.unit * 6,
    textAlign: 'left',
  },
  ul: {
    listStyleType: 'none',
    padding: 0,
  },
});

class Index extends React.Component {
  state = {
    brain: 2,
    brainText: 'Third Generation',
    zenobotImage: [zenobot0, zenobot1, zenobot2],
    botTip: [2105, 3744, 9360],
    input: '',
    proverb: '',
    lastTenProverbs: [],
    isLoading: false,
    popOverOpen: false,
    botImageRotation: 0,
    botImageHueRotation: 0,
    botImageSize: 100,
    botImagePosition: 0,
  };

  handleFieldChange = (e) => {
    const input = e.target.value;
    this.setState({ input });
    console.log(this.state);
  }

  handleBrainChange = (e) => {
    console.log(this.state)
    const brain = e.target.value;
    let brainText = '';
    switch (brain) {
      case 0:
        brainText = 'First Generation'
        break;
      case 1:
        brainText = 'Second Generation'
        break;
      case 2:
        brainText = 'Third Generation'
        break;
      default:
        brainText = 'First Generation'
        break;
    }
    this.setState({ brain, brainText });
  }

  handleSubmit = (e, input) => {
    if (input) this.getProverb(input);
    console.log('getting proverb for: ', input)
    e.preventDefault();
  }

  handlePopoverClick = (event) => {
    this.setState({ popOverOpen: event.currentTarget });
  }

  handlePopoverClose = () => {
    this.setState({ popOverOpen: null });
  }

  handleBotClick = () => {
    if (this.state.botImageRotation > 3000) {
      this.setState({
        botImageRotation: 0,
        botImageHueRotation: 0,
      })
      this.state.botImageSize < 500
      ? this.setState({ 
        botImageSize: this.state.botImageSize + 100,
        botImagePosition: this.state.botImagePosition + 100,
      })
      : this.setState({ 
        botImageSize: 100,
        botImagePosition: 0,
      })
    } else {
      this.setState({ 
        botImageRotation: this.state.botImageRotation + 360,
        botImageHueRotation: this.state.botImageHueRotation + 360,
      })
    }
  }

  getProverb = (input) => {
    let state = {...this.state};
    apiUrl = `http://127.0.0.1:5000/zenobot/proverb`;
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
      fetch(`${apiUrl}/${this.state.brain}/${input}`)
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
    const { 
      proverb, 
      lastTenProverbs, 
      isLoading, 
      input, 
      popOverOpen, 
      brain
    } = this.state;

    return (
      <div className={classes.root}>

        <div className={classes.homeLink}>
          <a href="https://garrettwatson.io" style={{textDecoration: "none"}}>
            <Button color="primary">
              Go to garrettwatson.io
            </Button>
          </a>
        </div>

        <div>
          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="brain-helper">Select Brain</InputLabel>
              <Select
                value={brain}
                onChange={this.handleBrainChange}
                input={<Input name="brain" id="brain-helper" />}
              >
                <MenuItem value={0}>First Generation</MenuItem>
                <MenuItem value={1}>Second Generation</MenuItem>
                <MenuItem value={2}>Third Generation</MenuItem>
              </Select>
              <FormHelperText>Swap Zenobot's Brains</FormHelperText>
            </FormControl>
          </form>
        </div>

        <Hidden smDown>
          <Typography variant="display4">
            <span style={{color:'#FEB415'}}>Z</span>enoBot
          </Typography>
        </Hidden>
        <Hidden mdUp>
          <Typography variant="display3">
            <span style={{color:'#FEB415'}}>Z</span>enoBot
          </Typography>
        </Hidden>

        <div className={classes.projectLinks}>       
          <a href="https://github.com/garrowat/zenobot-react" style={{textDecoration: "none"}}>
            <Tooltip title="github">
              <IconButton color="primary">
                <CodeIcon />
              </IconButton>
            </Tooltip>
          </a>
          <Tooltip title="about">
            <IconButton color="primary" onClick={this.handlePopoverClick}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
          <Popover
            open={Boolean(popOverOpen)}
            anchorEl={popOverOpen}
            onClose={this.handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Typography 
            className={classes.popOver} 
            paragraph={true} 
            variant="body2" 
            gutterBottom
            >
              {`
              Zenobot is an LSTM neural network that was trained, using PyTorch and fast.ai, on a small dataset of 2000 proverbs.
              The model is served up via a simple Flask API.
              Zenobot does its very best to predict the next character in a string, stopping when it predicts a period.
              `}
            </Typography>
            <Typography 
            className={classes.popOver} 
            paragraph={true} 
            variant="body2" 
            gutterBottom
            >
              <span style={{fontWeight: "bold"}}>Future plans:</span>
              {`
              add more models ("brains"), each trained on more proverbs, 
              so that humans can toggle between brains and see the effect on proverb generation. 
              `}
            </Typography>
          </Popover>
        </div>

        <Tooltip title={`Trained on ${this.state.botTip[brain]} proverbs! :D`}>
          <div 
          className={classes.botImageContainer} 
          onClick={this.handleBotClick}
          style={{ right: this.state.botImagePosition }}
          >
            <img 
            src={this.state.zenobotImage[brain]} 
            className={classes.botImage} 
            style={{ 
              filter: `hue-rotate(${this.state.botImageHueRotation}deg)`, 
              transform: `rotate(${this.state.botImageRotation}deg)`,
              width: `${this.state.botImageSize}%`,
              height: 'auto',
            }} 
            />
          </div>
        </Tooltip>

        <div className={classes.description}>
          <Typography variant="body2" style={{ fontFamily: "vt323", fontSize: "1.5em"}}>
            What troubles you, friend?
          </Typography>
          <form onSubmit={(e) => this.handleSubmit(e, input)}>
            <TextField 
            autoFocus={true}
            value={input || ''}
            onChange={(e) => this.handleFieldChange(e)}
            />
          </form>
        </div>

        <Paper className={classes.proverbBox}>
          {
            isLoading
            ? <CircularProgress />
            : <Typography 
            style={{ fontFamily: "vt323", fontSize: "150%" }} 
            variant='subheading'
            paragraph={true}>
              {proverb}
            </Typography>
          }
        </Paper>

        <ExpansionPanel className={classes.expansionPanel}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
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
        <Typography variant="caption">© 2018 Garrett Watson. All rights reserved.</Typography>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
