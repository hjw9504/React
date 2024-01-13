import {Link, useLocation, useParams, useSearchParams} from "react-router-dom";

export default function Index() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get("name");
  const {id} = useParams();

  return (
    <div>
      <h1>Index</h1>
      <p>상세 페이지입니다.</p>

      <ul>
        <li>
          <Link to="/">Home</Link>
          <p>id : {id}</p>
          <p>name : {name}</p>
        </li>
      </ul>
    </div>
  );
}
