import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { RoutesEnum } from "../../../app/router/types";
import {
  Box,
  Checkbox,
  FormControlLabel,
  List,
  Link as MuiLink,
  Pagination,
  Typography,
} from "@mui/material";
import { styles } from "../../../styles";
import { SupportRequestsItem } from "./SupportRequestsItem";
import { fetchClientsSupportRequests } from "../services/fetchClientSupportRequests";
import { refreshToken } from "../../profile/services/RefreshToken";
import { fetchSupportRequestData, fetchSupportRequestsResult } from "../types";
import { useServerError } from "../../../hooks/useServerError";

export const ClientSupportRequests: React.FC = () => {
  const [isActive, setIsActive] = useState(true);
  const [supportRequests, setSupportRequests] = useState(
    [] as fetchSupportRequestData[]
  );
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(10);
  const navigate = useNavigate();
  const { serverError, setError } = useServerError();

  const handleFetchSupportRequest = () => {
    fetchClientsSupportRequests(isActive, (page + 1) * limit, page * offset)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          refreshToken(navigate).then(() => {
            fetchClientsSupportRequests(
              isActive,
              (page + 1) * limit,
              page * offset
            )
              .then((response) => {
                if (response.status === 200) {
                  return response.json();
                }
              })
              .then((result: fetchSupportRequestsResult) => {
                if (result) {
                  setSupportRequests(result.result);
                  setCount(result.count);
                }
              });
          });
        } else {
          setError(new Error(`${response.statusText}`));
        }
      })
      .then((result: fetchSupportRequestsResult) => {
        if (result) {
          setSupportRequests(result.result);
          setCount(result.count);
        }
      });
  };

  useEffect(() => {
    handleFetchSupportRequest();
    window.scrollTo(0, 0);
  }, [page, isActive]);

  const supportRequestsList = supportRequests.map((supportRequest) => {
    return (
      <SupportRequestsItem
        key={supportRequest._id}
        supportRequest={supportRequest}
      />
    );
  });

  return (
    <>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bolder",
        }}
        align="center"
      >
        Техподдержка
      </Typography>
      <Box sx={{ display: "flex", gap: "15px" }}>
        <MuiLink
          color="#fff"
          component={RouterLink}
          to={RoutesEnum.CreateSupportRequest}
          type="button"
          variant="button"
          underline="none"
          sx={styles.link}
        >
          Создать обращение
        </MuiLink>
        <FormControlLabel
          name="isEnabled"
          control={
            <Checkbox
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          }
          label="Активные"
        />
      </Box>

      <List sx={{ width: "100%" }}>{supportRequestsList}</List>
      <Pagination
        count={count % limit ? Math.ceil(count / limit) : count / limit}
        page={page + 1}
        onChange={(e, value) => {
          setPage(value - 1);
        }}
        color="secondary"
        variant="outlined"
        shape="rounded"
      />
    </>
  );
};
