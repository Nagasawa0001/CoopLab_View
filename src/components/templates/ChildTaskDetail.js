import React from 'react';
import { withRouter } from 'react-router';
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { updateChildTaskStatusAction } from '../../modules/ChildTaskDetail';

import ViewListIcon from '@material-ui/icons/ViewList';
import Button from '@material-ui/core/Button';
import { fade } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import BlockIcon from '@material-ui/icons/Block';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.35),
    '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
    aaa: {
      width: 500,
    }
},
});

class ChildTaskDetail extends React.Component {
  constructor(props){
    super(props);
    this.state = { value: ''};
  }

  componentDidMount() {
    if (!this.props.loggedIn) {
      document.cookie = "JSESSIONID=; expires=0";
      this.props.history.push('/signin');
    }
  }

  updateChildTaskStatus(e) {
    this.props.updateChildTaskStatusAction(this.props.childTask.id, e.currentTarget.value);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
                            CHILD TASK
            </Typography>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label="mailbox folders">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              <div className={classes.toolbar} />
              <Divider />
              <List>
              </List>

            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
        <BottomNavigation
      value={this.state.value}
      onChange={(event, newValue) => {
        this.setState({ value: newValue});
      }}
      showLabels
      className={classes.aaa}
    >
      <BottomNavigationAction label="All" icon={<ViewListIcon />} />
      <BottomNavigationAction label="Done" icon={<DoneOutlineIcon />} />
      <BottomNavigationAction label="Deleted" icon={<DeleteForeverIcon />} />
      <BottomNavigationAction label="Canceled" icon={<BlockIcon />} />
    </BottomNavigation>
          <div className={classes.toolbar} />
          <Paper >
          <Button color="primary" variant="outlined" value='1' onClick={this.updateChildTaskStatus.bind(this)}>Done</Button>
          <Button color="secondary" variant="outlined" value='2' onClick={this.updateChildTaskStatus.bind(this)}>Delete</Button>
          <Button color="default" variant="outlined" value='3' onClick={this.updateChildTaskStatus.bind(this)}>Cancel</Button>
          <Typography>子タスク詳細</Typography>
            <Typography>{this.props.childTask.title}</Typography>
            <Typography>{this.props.childTask.content}</Typography>
          </Paper>
          {
                this.props.taskCommentList.map((taskComment) =>
                  <Paper className={classes.card} key={taskComment.id}>
                      <Typography gutterBottom variant='p' component='h2' >
                        {taskComment.content}
                      </Typography>
                      <Typography variant='body2' color='textSecondary' component='p' className={classes.metaInfo}>
                        CREATEDDATE:{taskComment.createdDate}
                                            </Typography>
                    </Paper>
                )
              }
        </main>
      </div>
    )
  }
}

ChildTaskDetail = reduxForm({
  form: 'ChildTaskDetail'
})(ChildTaskDetail)


function mapStateToProps(store) {
  return {
    childTask: store.userInfo.loggedIn ? store.childTask.childTask : {},
    taskCommentList: store.userInfo.loggedIn ? store.childTask.taskCommentList : [],
    loggedIn: store.userInfo.loggedIn
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateChildTaskStatusAction(childTaskId, status) {
        dispatch(updateChildTaskStatusAction(childTaskId, status));
    }
  }
}


export default withStyles(styles)(withRouter(connect(mapStateToProps, mapDispatchToProps)(ChildTaskDetail)));