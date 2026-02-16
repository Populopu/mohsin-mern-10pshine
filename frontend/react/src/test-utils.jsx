import PropTypes from "prop-types";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

const AllProviders = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

AllProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
