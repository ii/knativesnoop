<script>
 export let segment;
 $: home = (segment !== 'about' && segment !== 'conformance-progress');
</script>

<nav>
  <ul>
    <li class="title"> <b>KnativeSnoop</b></li>
    <li><a aria-current="{home ? 'page' : undefined}" href="/">home</a></li>
    <li><a aria-current="{segment === 'about' ? 'page' : undefined}" href="/about">about</a></li>
    <!-- src is at conformance-progress/Index.svelte, so segment is 'Index' -->
    <!-- <li><a rel=prefetch aria-current="{segment === 'conformance-progress' ? 'page' : undefined}" href="/conformance-progress">conformance progress</a></li> -->
  </ul>
</nav>

<style>
 nav {
   background: indigo;
   color: yellow;
   border-bottom: 1px solid lavender;
   font-weight: 300;
   padding: 0 1em;
 }

 ul {
   margin: 0;
   padding: 0;
     display: flex;
     justify-content: flex-start;
     align-items: center;
 }

 li.title {
     display: flex;
     justify-content: center;
     align-items: center;
     margin-right: 1.5rem;
 }

 /* clearfix */
 ul::after {
   content: '';
   display: block;
   clear: both;
 }

 li {
   display: block;
   float: left;
 }

 [aria-current] {
   position: relative;
   display: inline-block;
 }

 [aria-current]::after {
   position: absolute;
   content: '';
   width: calc(100% - 1em);
   height: 2px;
   background-color: rgb(255,62,0);
   display: block;
   bottom: -1px;
 }

 a {
   text-decoration: none;
   padding: 1em 0.5em;
   display: block;
   cursor: pointer;
 }
</style>
