import PropTypes from 'prop-types';
import Header from './Header';
import Footer from './Footer';

function MainLayout({ children }) {
  return (
    <div>
      <Header />
      <main className="bg-transparent">{children}</main>
      <Footer />
    </div>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
