import { useState, useEffect } from "react";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import axios from "axios";
import _ from "lodash";
import {
  notification,
  Typography,
  Input,
  Row,
  Col,
  Button,
  Card,
  Steps,
  Form,
  Collapse,
} from "antd";

const { Title } = Typography;
const { TextArea } = Input;
const { Step } = Steps;
const { Panel } = Collapse;

const Page = () => {
  const [form] = Form.useForm();
  const [appProfile, setAppProfile] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  const stepData = [
    { title: "Application", path: "Application" },
    { title: "Application Consumers", path: "Application Consumers" },
    { title: "Microservices", path: "Microservices" },
    { title: "Data Sources", path: "Data Sources" },
    { title: "Traffic And Load", path: "Traffic And Load" },
    { title: "Deployment Context", path: "Deployment Context" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/appProfile");
      setAppProfile(response.data);
      form.setFieldsValue(response.data);
    } catch (error) {
      console.error("Error fetching app profile data:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:3001/api/application-profiles", appProfile);
      console.log("App profile updated successfully!");
      console.log(appProfile);

      notification.success({
        message: "Success",
        description: "The application profile has been submitted successfully!",
      });
    } catch (error) {
      console.log(error);
      console.error("Error updating app profile:", error);

      // Log the error response from the server, if any
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        console.log(error.response);
      }

      notification.error({
        message: "Error",
        description: "There was an error while submitting the application profile.",
      });
    }
  };

  const handleInputChange = (e, path) => {
    const { value } = e.target;

    setAppProfile((prevState) => {
      const updatedProfile = _.cloneDeep(prevState);
      _.set(updatedProfile, path, value);
      return updatedProfile;
    });
  };

  const handleRemove = (path, index) => {
    setAppProfile((prevState) => {
      const updatedProfile = _.cloneDeep(prevState);
      _.pullAt(_.get(updatedProfile, path), index);
      return updatedProfile;
    });
  };

  const handleAddArrayElement = (path) => {
    setAppProfile((prevState) => {
      const updatedProfile = _.cloneDeep(prevState);
      const arrayToModify = _.get(updatedProfile, path);
      let newElement = {};
      switch (path) {
        case "Application Consumers":
          newElement = {
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
          };
          break;
        case "Microservices":
          newElement = {
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
          };
          break;
        case "Data Sources":
          newElement = {
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
          };
          break;
        case "Traffic And Load":
          newElement = {
            "Traffic Type": {
              "Request Type": "",
              Frequency: "",
              "Peak Times": "",
              "Performance Requirements": "",
            },
            "Load Balancing Strategy": "",
          };
          break;
        case "Deployment Context":
          newElement = {
            Location: "",
            "Cloud Platforms": "",
            "Containerization Details": "",
            CI_CD_Pipeline: "",
          };
          break;
        default:
          newElement = {
            "Interface Type": "",
            Endpoint: "",
          };
          break;
      }
      arrayToModify.push(newElement);
      return updatedProfile;
    });
  };

  const renderForm = (data, path = "") => {
    if (Array.isArray(data)) {
      return (
        <div>
          {data.map((item, index) => (
            <Card title={`${path.split(".").pop()} ${index + 1}`} key={`${path}-${index}`}>
              {renderForm(item, `${path}[${index}]`)}
              <Button
                type="primary"
                danger
                onClick={() => handleRemove(path, index)}
                style={{ marginTop: "20px" }}
              >
                Remove {path.split(".").pop()} {index + 1}
              </Button>
            </Card>
          ))}
          <Button
            type="primary"
            onClick={() => handleAddArrayElement(path)}
            style={{ marginTop: "20px" }}
          >
            Add New {path.split(".").pop()}
          </Button>
        </div>
      );
    }

    if (typeof data === "object" && !Array.isArray(data)) {
      return Object.entries(data).map(([key, value]) => {
        const newPath = path ? `${path}.${key}` : key;
        if (typeof value === "object" || Array.isArray(value)) {
          return (
            <Collapse key={newPath} bordered={false} defaultActiveKey={[]}>
              <Panel header={key} key={newPath}>
                {renderForm(value, newPath)}
              </Panel>
            </Collapse>
          );
        } else {
          return renderForm(value, newPath);
        }
      });
    }

    return (
      <Row key={path} gutter={[16, 16]} align="top">
        <Col xs={24}>
          <Title level={5}>{path.split(".").pop()}</Title>
          <Form.Item>
            <Input placeholder="Enter value" onChange={(e) => handleInputChange(e, path)} />
          </Form.Item>
        </Col>
      </Row>
    );
  };

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <>
      <Head>
        <title>Application Profile</title>
      </Head>
      <div style={{ padding: "20px" }}>
        <Title level={2}>Application Profile</Title>
        <Form form={form} onFinish={handleSubmit}>
          <Steps current={currentStep} style={{ margin: "20px 0" }}>
            {stepData.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">
            {renderForm(_.get(appProfile, stepData[currentStep].path), stepData[currentStep].path)}
          </div>
          <div className="steps-action">
            {currentStep > 0 && (
              <Button style={{ margin: "10px 8px 10px 0" }} onClick={prev}>
                Previous
              </Button>
            )}
            {currentStep < stepData.length - 1 && (
              <Button type="primary" onClick={next} style={{ margin: "10px 0" }}>
                Next
              </Button>
            )}
            {currentStep === stepData.length - 1 && (
              <Button type="primary" htmlType="submit" style={{ margin: "10px 0" }}>
                Submit
              </Button>
            )}
          </div>
        </Form>
      </div>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
