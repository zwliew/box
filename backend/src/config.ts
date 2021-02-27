import convict from "convict";

const config = convict({
  port: {
    doc: "The port for the express server to bind to.",
    format: "port",
    default: 0,
    env: "PORT",
  },
  aws: {
    s3Region: {
      doc: "The region of the S3 storage bucket.",
      format: String,
      default: "",
      env: "AWS_S3_REGION",
      sensitive: true,
    },
    s3Bucket: {
      doc: "The bucket name of the S3 storage bucket.",
      format: String,
      default: "",
      env: "AWS_S3_BUCKET",
      sensitive: true,
    },
    profile: {
      doc: "The AWS profile to use.",
      format: String,
      default: "default",
      env: "AWS_PROFILE",
      sensitive: true,
    },
  },
});

export default config;
