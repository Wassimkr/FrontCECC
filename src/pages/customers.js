import { useState, useEffect } from "react";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import axios from "axios";
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
      await axios.post("/api/application-profiles", appProfile);
      console.log("App profile updated successfully!");
    } catch (error) {
      console.error("Error updating app profile:", error);
    }
  };

  const handleAddApplicationConsumer = () => {
    setAppProfile((prevState) => ({
      ...prevState,
      "Application Consumers": [
        ...prevState["Application Consumers"],
        {
          "Profile Type": "",
          Characteristics: "",
          "Interfaces Experiences": [
            {
              "Interface Type": "",
              Endpoint: "",
            },
          ],
          "Consumer Specific Functionality": "",
          "Authentication And Authorization": {
            Method: "",
            Permissions: "",
          },
        },
      ],
    }));
  };

  const handleAddMicroservice = () => {
    setAppProfile((prevState) => ({
      ...prevState,
      Microservices: [
        ...prevState["Microservices"],
        {
          Name: "",
          Purpose: "",
          Functionality: "",
          "API Endpoints": [
            {
              Endpoint: "",
              Purpose: "",
              Method: "",
            },
          ],
          Dependencies: [
            {
              ServiceName: "",
              Purpose: "",
            },
          ],
          "Resource Requirements": {
            CPU: "",
            Memory: "",
            Storage: "",
          },
          "Operational Aspects": {
            Monitoring: "",
            Logging: "",
            "Deployment Scaling Instructions": "",
          },
        },
      ],
    }));
  };

  const handleAddDataSource = () => {
    setAppProfile((prevState) => ({
      ...prevState,
      "Data Sources": [
        ...prevState["Data Sources"],
        {
          "Source Name": "",
          Details: "",
          "Data Models": [
            {
              "Model Name": "",
              Attributes: "",
            },
          ],
          "Data Access And Security": {
            "Access Method": "",
            "Security Measures": "",
          },
          "Data Governance": {
            "Management Strategy": "",
            "Cleaning Strategy": "",
            "Consistency Strategy": "",
          },
        },
      ],
    }));
  };

  const handleAddTrafficType = () => {
    setAppProfile((prevState) => ({
      ...prevState,
      "Traffic And Load": {
        ...prevState["Traffic And Load"],
        "Traffic Type": {
          "Request Type": "",
          Frequency: "",
          "Peak Times": "",
          "Performance Requirements": "",
        },
      },
    }));
  };

  const renderForm = (data, path = "") => {
    return Object.entries(data).map(([key, value]) => {
      const newPath = path ? `${path}.${key}` : key;

      if (Array.isArray(value)) {
        return (
          <Collapse key={newPath} bordered={false} defaultActiveKey={[]}>
            <Panel header={key} key={newPath}>
              {value.map((item, index) => (
                <div key={`${newPath}-${index}`}>{renderForm(item, `${newPath}[${index}]`)}</div>
              ))}
              {key === "Application Consumers" && (
                <Button
                  type="primary"
                  onClick={handleAddApplicationConsumer}
                  style={{ marginTop: "20px" }}
                >
                  Add New Application Consumer
                </Button>
              )}
              {key === "Microservices" && (
                <Button
                  type="primary"
                  onClick={handleAddMicroservice}
                  style={{ marginTop: "20px" }}
                >
                  Add New Microservice
                </Button>
              )}
              {key === "Data Sources" && (
                <Button type="primary" onClick={handleAddDataSource} style={{ marginTop: "20px" }}>
                  Add New Data Source
                </Button>
              )}
              {key === "Traffic And Load" && (
                <Button type="primary" onClick={handleAddTrafficType} style={{ marginTop: "20px" }}>
                  Add New Traffic Type
                </Button>
              )}
            </Panel>
          </Collapse>
        );
      }

      if (typeof value === "object" && !Array.isArray(value)) {
        return (
          <Collapse key={newPath} bordered={false} defaultActiveKey={[]}>
            <Panel header={key} key={newPath}>
              {renderForm(value, newPath)}
            </Panel>
          </Collapse>
        );
      }

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
            Submit
          </Button>
        </form>
      </div>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
