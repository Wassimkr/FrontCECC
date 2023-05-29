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
  Collapse,
  Form,
  Tabs,
} from "antd";

const { Title } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;
const { TabPane } = Tabs;

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
      const arrayOrObjectToModify = _.get(updatedProfile, path);
      if (Array.isArray(arrayOrObjectToModify)) {
        _.pullAt(arrayOrObjectToModify, index);
      } else if (typeof arrayOrObjectToModify === "object") {
        delete arrayOrObjectToModify[index];
      }
      return updatedProfile;
    });
  };

  const handleAddArrayElement = (path) => {
    setAppProfile((prevState) => {
      const updatedProfile = _.cloneDeep(prevState);
      const arrayToModify = _.get(updatedProfile, path, []);
      if (Array.isArray(arrayToModify)) {
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
              "Authentication And Authorization": [
                {
                  Method: "",
                  Permissions: "",
                },
              ],
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
          default:
            newElement = {
              "Interface Type": "",
              Endpoint: "",
            };
            break;
        }
        arrayToModify.push(newElement);
        _.set(updatedProfile, path, arrayToModify);
      }
      return updatedProfile;
    });
  };

  const renderForm = (data, path = "") => {
    return Object.entries(data).map(([key, value]) => {
      const newPath = path ? `${path}.${key}` : key;

      const addRemoveButtonKeys = [
        "Application Consumers",
        "Microservices",
        "Data Sources",
        "Traffic And Load",
      ];

      const isArrayParent = addRemoveButtonKeys.includes(key);

      if (Array.isArray(value)) {
        return (
          <Collapse key={newPath} bordered={false} defaultActiveKey={[]}>
            <Panel header={key} key={newPath}>
              <Collapse bordered={false} defaultActiveKey={[]}>
                {value.map((item, index) => (
                  <Panel header={`${key} ${index + 1}`} key={`${newPath}.${index}`}>
                    {renderForm(item, `${newPath}[${index}]`)}
                    <Button
                      type="primary"
                      danger
                      onClick={() => handleRemove(newPath, index)}
                      style={{ marginTop: "20px" }}
                    >
                      Remove {key} {index + 1}
                    </Button>
                  </Panel>
                ))}
              </Collapse>
              {isArrayParent && (
                <Button
                  type="primary"
                  onClick={() => handleAddArrayElement(newPath.split(".").slice(0, -1).join("."))}
                  style={{ marginTop: "20px" }}
                >
                  Add New {key}
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
              {isArrayParent && (
                <Button
                  type="primary"
                  danger
                  onClick={() => handleRemove(path, outerIndex)}
                  style={{ marginTop: "20px" }}
                >
                  Remove {key}
                </Button>
              )}
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
            <Form.Item>
              <TextArea rows={4} onChange={(e) => handleInputChange(e, newPath)} />
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
        <Form form={form} onFinish={handleSubmit}>
          <Tabs type="card">
            <TabPane tab="Application" key="1">
              {renderForm({ Application: appProfile["Application"] || {} })}
            </TabPane>
            <TabPane tab="Application Consumers" key="2">
              {renderForm(
                { "Application Consumers": appProfile["Application Consumers"] || [] },
                "Application Consumers",
                true
              )}
            </TabPane>
            <TabPane tab="Microservices" key="3">
              {renderForm(
                { Microservices: appProfile["Microservices"] || [] },
                "Microservices",
                true
              )}
            </TabPane>
            <TabPane tab="Data Sources" key="4">
              {renderForm(
                { "Data Sources": appProfile["Data Sources"] || [] },
                "Data Sources",
                true
              )}
            </TabPane>
            <TabPane tab="Traffic And Load" key="5">
              {renderForm(
                { "Traffic And Load": appProfile["Traffic And Load"] || [] },
                "Traffic And Load",
                true
              )}
            </TabPane>
            <TabPane tab="Deployment Context" key="6">
              {renderForm({ "Deployment Context": appProfile["Deployment Context"] || {} })}
            </TabPane>
          </Tabs>
          <Button type="primary" htmlType="submit" style={{ marginTop: "20px" }}>
            Submit
          </Button>
        </Form>
      </div>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
