import styles from "./CajeroPage.module.css";
import Table from "../../components/CajeroViews/Tableview";

const CajeroPage = () => {
  return (
    <div className={styles.cajeroPage_wrapper}>
      <Table onBack={function (): void {
        throw new Error("Function not implemented.");
      } }/>
    </div>
  );
};

export default CajeroPage;
