import React, { useState, useEffect } from "react";
import { fetchHotels } from "../services/fetchHotels";
import { FetchHotelsData, FetchHotelData } from "../types";
import { RoutesEnum } from "../../../app/router/types";
import { useNavigate } from "react-router-dom";
import { List, Pagination } from "@mui/material";
import { HotelListItem } from "./HotelListItem";
import { refreshToken } from "../../profile/services/RefreshToken";

export const SearchHotels: React.FC = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([] as FetchHotelData[]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(10);

  useEffect(() => {
    fetchHotels((page + 1) * limit, page * offset)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          refreshToken(navigate).then(() => {
            fetchHotels((page + 1) * limit, page * offset)
              .then((response) => {
                if (response.status === 200) {
                  return response.json();
                }
              })
              .then((result) => {
                if (result) {
                  setHotels(result.hotels);
                  setCount(result.count);
                }
              });
          });
        } else {
          navigate(RoutesEnum.ServerError);
        }
      })
      .then((result: FetchHotelsData) => {
        if (result) {
          setHotels(result.hotels);
          setCount(result.count);
        }
      });
    window.scrollTo(0, 0);
  }, [page]);

  const hotelsList = hotels.map((hotel) => {
    return <HotelListItem key={hotel._id} hotel={hotel} />;
  });

  return (
    <>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {hotelsList}
      </List>
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
