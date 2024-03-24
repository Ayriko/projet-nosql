import React, { useEffect, useState } from 'react';
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {decodeToken, follow, getFollowedAccount, getUserById, unFollow} from '../client/client';
import UserType from '../models/user';
import FollowerModal from "./FollowerModal.tsx";

function ProfileComponent({userId} : {userId : string }): React.JSX.Element {
    const [user, setUser] = useState<UserType>();
    const [isFollowed, setIsFollowed] = useState(false)
    const [updateFollowerModalOpen, setUpdateFollowerModalOpen] = React.useState(false);


  const tokenPayload = decodeToken()

    useEffect(() => {
          getUserById(userId)
              .then(async (user) => {
                  setUser(user);
                  await updateFollowed()
              })
              .catch(error => {
                  console.error("Erreur lors de la récupération de l'utilisateur :", error);
              });
      }, [userId, isFollowed]);

    const updateFollowed = async () => {
      getFollowedAccount(tokenPayload.id).then((response) => {
        setIsFollowed(response.users.includes(userId))
      })
    }

  const handleFollow = async () => {
    try {
      if (isFollowed) {
        await unFollow(userId, tokenPayload.id)
      } else {
        await follow(userId, tokenPayload.id)
      }
      await updateFollowed();
    }catch (e) {
      console.log('error', e)
    }
  }

    const handleOpenFollowerModal = () => {
      setUpdateFollowerModalOpen(true)
    }

      return (
          <Box display="flex" flexDirection="column" alignItems="center" maxWidth={800} margin={"auto"} marginTop={'5em'} textAlign="center">
              <Box marginBottom={4}>
                  <Avatar sx={{ width: 120, height: 120, bgcolor: 'primary.main', color: 'white' }}>
                      <Typography variant="h2">
                          {user?.username.charAt(0).toUpperCase()}
                      </Typography>
                  </Avatar>
              </Box>
              <Box marginBottom={4}>
                  <Typography variant="h4" color="white">
                      {user?.username}
                  </Typography>
                  <Typography variant="subtitle1" color="white">
                  </Typography>
                <Button variant="contained" color="primary" onClick={handleOpenFollowerModal}>
                  Follower
                </Button>
              </Box>
            { userId !== tokenPayload.id && (
              <Button variant="contained" color="primary" onClick={handleFollow}>
                {isFollowed ? "UnFollow" : "Follow"}
              </Button>
            )}
            <FollowerModal
              open={updateFollowerModalOpen}
              onClose={() => setUpdateFollowerModalOpen(false)}
              selectedUserId={userId}
              isFollowed={isFollowed}
            />
          </Box>
      );
}

export default ProfileComponent;
