import Category from '../../components/LandingPage/Category/Category';
import styles from './LandingPage.module.css';
import PhotoLanding from '../../components/LandingPage/PhotoLanding/PhotoLanding';

const LandingPage = () => {
  return (
    <div className={styles.landingPage_wrapper}>
      <PhotoLanding />
      <Category />
    </div>
  )
}

export default LandingPage
