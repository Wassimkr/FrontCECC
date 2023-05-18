import rdfParser from "rdf-parse";
import rdf from "rdf";
import streamify from "streamify-string";

export default async function handler(req, res) {
  const ontologyURI = "http://localhost:3000/assets/OSR_Ontology.owl";
  const response = await fetch(ontologyURI);
  var owlString = await response.text();
  const owlStream = streamify(owlString);
  const classes = [];
  const OWL = "http://www.w3.org/2002/07/owl#";
  const classTypeOri = `${OWL}Class`;
  const CLASS_TYPE = rdf.NamedNode(`${OWL}Class`);
  try {
    rdfParser
      .parse(owlStream, { contentType: "application/rdf+xml" })
      .on("data", (quad) => {
        // Check if the quad is a class
        if (quad.object.value === classTypeOri) {
          // Add the class to the array
          classes.push(quad.subject.value.split("#")[1]);
        }
      })
      .on("error", (error) => console.error(error))
      .on("end", () => {
        console.log("All classes:");
        res.status(200).json(classes);
        console.log(classes);
      });
  } catch (err) {
    console.log(err);
  }
}
