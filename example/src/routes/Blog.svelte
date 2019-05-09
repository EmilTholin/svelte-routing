<script>
  import { Router, Link, Route } from "svelte-routing";
</script>

<Router>
  <h1>Blog</h1>

  <ul>
    <li><Link to="first">Today I did something cool</Link></li>
    <li><Link to="second">I did something awesome today</Link></li>
    <li><Link to="third">Did something sweet today</Link></li>
  </ul>

  <Route path="first">
    <p>
      I did something cool today. Lorem ipsum dolor sit amet, consectetur 
      adipisicing elit. Quisquam rerum asperiores, ex animi sunt ipsum. Voluptas 
      sint id hic. Vel neque maxime exercitationem facere culpa nisi, nihil 
      incidunt quo nostrum, beatae dignissimos dolores natus quaerat! Quasi sint 
      praesentium inventore quidem, deserunt atque ipsum similique dolores maiores
      expedita, qui totam. Totam et incidunt assumenda quas explicabo corporis 
      eligendi amet sint ducimus, culpa fugit esse. Tempore dolorum sit 
      perspiciatis corporis molestias nemo, veritatis, asperiores earum! 
      Ex repudiandae aperiam asperiores esse minus veniam sapiente corrupti 
      alias deleniti excepturi saepe explicabo eveniet harum fuga numquam 
      nostrum adipisci pariatur iusto sint, impedit provident repellat quis?
    </p>
  </Route>
  <Route path="second">
    <p>
      I did something awesome today. Lorem ipsum dolor sit amet, consectetur 
      adipisicing elit. Repudiandae enim quasi animi, vero deleniti dignissimos 
      sapiente perspiciatis. Veniam, repellendus, maiores.
    </p>
  </Route>
  <Route path="third">
    <p>
      I did something sweet today. Lorem ipsum dolor sit amet, consectetur 
      adipisicing elit. Modi ad voluptas rem consequatur commodi minima doloribus 
      veritatis nam, quas, culpa autem repellat saepe quam deleniti maxime delectus 
      fuga totam libero sit neque illo! Sapiente consequatur rem minima expedita 
      nemo blanditiis, aut veritatis alias nostrum vel? Esse molestias placeat, 
      doloribus commodi.
    </p>
  </Route>
</Router>
