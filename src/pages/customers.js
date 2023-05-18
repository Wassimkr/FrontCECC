import { useCallback, useState, useEffect, Component } from "react";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import axios from "axios";
import rdflib from "rdflib";
import { Typography, Input, Row, Col, Button, Card } from "antd";

const { Title } = Typography;
const { TextArea } = Input;

const Page = () => {
  const [appProfile, setAppProfile] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/appProfile");
      setAppProfile(response.data);
    } catch (error) {
      console.error("Error fetching app profile data:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAppProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post("/api/appProfile", appProfile);
      console.log("App profile updated successfully!");
    } catch (error) {
      console.error("Error updating app profile:", error);
    }
  };

  const renderForm = (data) => {
    return Object.entries(data).map(([key, value]) => {
      if (typeof value === "object") {
        return (
          <div key={key} style={{ marginBottom: "16px" }}>
            <Card variant="outlined">
              <Title level={4}>{key}</Title>
              {renderForm(value)}
            </Card>
          </div>
        );
      } else {
        return (
          <Row key={key} gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Title level={5}>{key}</Title>
            </Col>
            <Col xs={24} sm={12}>
              <TextArea rows={4} name={key} value={value} onChange={handleInputChange} />
            </Col>
          </Row>
        );
      }
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Application Profile Dashboard</Title>
      <form onSubmit={handleSubmit}>
        {renderForm(appProfile)}
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </form>
    </div>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
