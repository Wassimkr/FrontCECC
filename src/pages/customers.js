import { useCallback, useState, useEffect, Component } from "react";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import axios from "axios";
import rdflib from "rdflib";
import { Typography, Input, Row, Col, Button, Card, Collapse, Form } from "antd";

const { Title } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

const Page = () => {
  const [form] = Form.useForm();
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

  const renderForm = (data, path = "") => {
    return Object.entries(data).map(([key, value]) => {
      const newPath = path ? `${path}.${key}` : key;
      if (Array.isArray(value)) {
        // If value is an array, we get the first element
        value = value[0];
      }

      if (typeof value === "object" && !Array.isArray(value)) {
        return (
          <Collapse key={newPath} bordered={false} defaultActiveKey={[]}>
            <Panel header={key} key="1">
              {renderForm(value, newPath)}
            </Panel>
          </Collapse>
        );
      } else {
        return (
          <Row key={newPath} gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Title level={5}>{key}</Title>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name={newPath}>
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
        );
      }
    });
  };

  return (
    <>
      <Head>
        <title>Application Profile</title>
      </Head>
      <div style={{ padding: "20px" }}>
        <Title level={2}>Application Profile</Title>
        <form onSubmit={handleSubmit}>
          {renderForm(appProfile)}
          <Button type="primary" htmlType="submit" style={{ marginTop: "20px" }}>
            Update
          </Button>
        </form>
      </div>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
