import { useCallback, useState, useEffect, Component } from "react";
import Head from "next/head";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import axios from "axios";
import rdflib from "rdflib";

const Page = () => {
  const [classList, setClassList] = useState([]);
  useEffect(() => {
    axios.get("/api/ontology").then((res) => {
      const list = res.data;
      setClassList(list);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Application Profile</title>
      </Head>
      <Card>
        <CardHeader subheader="Create new application profile" title="Application Profile" />
      </Card>
      <Card>
        {classList.map((item, index) => {
          return <div key={index}>{item}</div>;
        })}
      </Card>

      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button variant="contained">Save details</Button>
      </CardActions>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
