import { Link } from "react-router-dom";
import { PageLink } from "../../utils/links";

export default function NotFoundPage() {
    return (
      <>
        <h1>
            Not found
        </h1>
        <Link to={PageLink.main}>
            Main page
        </Link>
      </>
    );
}