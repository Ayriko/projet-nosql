import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import * as React from "react";
import {useEffect, useState} from "react";
import {
  decodeToken,
  getFollowedAccount,
  getFollowerAccount,
  getRecommendationAccount,
  getUserById
} from "../client/client.ts";
import UserType from "../models/user.ts";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";
import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";

interface UpdateModalProps {
  open: boolean;
  onClose: () => void;
  selectedUserId: string;
  isFollowed: boolean;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function FollowerModal({ open, onClose, selectedUserId, isFollowed }: UpdateModalProps) {

  const [followedExpanded, setFollowedExpanded] = React.useState(false);
  const [followerExpanded, setFollowerExpanded] = React.useState(false);
  const [recommendationExpanded, setRecommendationExpanded] = React.useState(false);
  const [followedUser, setFollowedUser] = useState<UserType[]>([])
  const [followerUser, setFollowerUser] = useState<UserType[]>([])
  const [recommendationUser, setRecommendationUser] = useState<UserType[]>([])
  const tokenPayload = decodeToken()

  useEffect(() => {
    getFollowedAccount(selectedUserId).then((response) => {
      const followedUsersPromises = response.users.map(async (userId: string) => {
        return await getUserById(userId);
      });
      Promise.all(followedUsersPromises).then((followedUsers) => {
        setFollowedUser(followedUsers);
      });
    });
    getFollowerAccount(selectedUserId).then((response) => {
      const followerUsersPromises = response.users.map(async (userId: string) => {
        return await getUserById(userId);
      });
      Promise.all(followerUsersPromises).then((followerUsers) => {
        setFollowerUser(followerUsers);
      });
    });
    getRecommendationAccount(tokenPayload.id).then((response) => {
      const recommendationUsersPromises = response.users.map(async (userId: string) => {
        return await getUserById(userId);
      });
      Promise.all(recommendationUsersPromises).then((recommendationUsers) => {
        setRecommendationUser(recommendationUsers);
      });
    });
  }, [selectedUserId, isFollowed]);

  const handleExpandFollowedClick = () => {
    setFollowerExpanded(false);
    setRecommendationExpanded(false);
    setFollowedExpanded(!followedExpanded);
  };

  const handleExpandFollowerClick = () => {
    setFollowedExpanded(false);
    setRecommendationExpanded(false);
    setFollowerExpanded(!followerExpanded);
  };

  const handleExpandRecommendationClick = () => {
    setFollowerExpanded(false);
    setFollowedExpanded(false);
    setRecommendationExpanded(!recommendationExpanded);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
        <Card onClick={handleExpandFollowedClick}>
          <Button color="primary">
            Followed
          </Button>
          <Collapse in={followedExpanded} timeout="auto" unmountOnExit>
            <CardContent>
              { followedUser.length > 0 ?
                followedUser.map((user : UserType, index : number) => {
                  return (
                    <div key={index}>
                      <Card>
                        <div style={{display: 'flex'}}>
                          <CardHeader avatar={
                            <Link to={`/profil/${user._id}`} onClick={onClose}>
                              <Avatar sx={{ bgcolor: 'black' }} aria-label="recipe">
                                <Typography variant="subtitle2" color="white">
                                  {user.username.charAt(0).toUpperCase()}
                                </Typography>
                              </Avatar>
                            </Link>
                          }/>
                          <div style={{flexDirection: 'column', paddingTop: '1.5rem'}}>
                            <Typography variant="subtitle2" color="black">
                              {user.username}
                            </Typography>
                          </div>
                        </div>
                      </Card>
                    </div>
                  );})
                : ''
              }
            </CardContent>
          </Collapse>
        </Card>
        <Card onClick={handleExpandFollowerClick}>
          <Button color="primary">
            Follower
          </Button>
          <Collapse in={followerExpanded} timeout="auto" unmountOnExit>
            <CardContent>
              { followerUser.length > 0 ?
                followerUser.map((user : UserType, index : number) => {
                  return (
                    <div key={index}>
                      <Card>
                        <div style={{display: 'flex'}}>
                          <CardHeader avatar={
                            <Link to={`/profil/${user._id}`} onClick={onClose}>
                              <Avatar sx={{ bgcolor: 'black' }} aria-label="recipe">
                                <Typography variant="subtitle2" color="white">
                                  {user.username.charAt(0).toUpperCase()}
                                </Typography>
                              </Avatar>
                            </Link>
                          }/>
                          <div style={{flexDirection: 'column', paddingTop: '1.5rem'}}>
                            <Typography variant="subtitle2" color="black">
                              {user.username}
                            </Typography>
                          </div>
                        </div>
                      </Card>
                    </div>
                  );})
                : ''
              }
            </CardContent>
          </Collapse>
        </Card>
          { selectedUserId === tokenPayload.id && (
            <Card onClick={handleExpandRecommendationClick}>
              <Button onClick={handleExpandRecommendationClick} color="primary">
                Recommendations
              </Button>
              <Collapse in={recommendationExpanded} timeout="auto" unmountOnExit>
                <CardContent>
                  { recommendationUser.length > 0 ?
                    recommendationUser.map((user : UserType, index : number) => {
                      return (
                        <div key={index}>
                          <Card>
                            <div style={{display: 'flex'}}>
                              <CardHeader avatar={
                                <Link to={`/profil/${user._id}`} onClick={onClose}>
                                  <Avatar sx={{ bgcolor: 'black' }} aria-label="recipe">
                                    <Typography variant="subtitle2" color="white">
                                      {user.username.charAt(0).toUpperCase()}
                                    </Typography>
                                  </Avatar>
                                </Link>
                              }/>
                              <div style={{flexDirection: 'column', paddingTop: '1.5rem'}}>
                                <Typography variant="subtitle2" color="black">
                                  {user.username}
                                </Typography>
                              </div>
                            </div>
                          </Card>
                        </div>
                      );})
                    : ''
                  }
                </CardContent>
          </Collapse>
        </Card>
        )}
        </div>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Modal>
  );
}
