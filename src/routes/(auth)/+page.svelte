<script lang="ts">
	import { PUBLIC_GITHUB_ID } from '$env/static/public';
	import Fa from 'svelte-fa';
	import { faGithub, faGoogle, faApple, faFacebook } from '@fortawesome/free-brands-svg-icons';
	import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

	const github_url = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${PUBLIC_GITHUB_ID}`;
</script>

<h1 class="text-center text-4xl font-extrabold text-surface-700 dark:text-surface-300">Logga in</h1>
<div class="flex flex-col items-center gap-4">
	<a
		class="block rounded-container-token w-full md:max-w-72 p-4 dark:bg-surface-900 border dark:border-surface-800 flex items-center justify-center space-x-2 text-surface-700 dark:text-surface-300"
		href={github_url}
	>
		<Fa icon={faGithub} size="lg" />
		<span>Logga in med GitHub</span>
	</a>
	<div
		class="rounded-container-token w-full md:max-w-72 p-4 dark:bg-surface-900 border dark:border-surface-800 flex items-center justify-center space-x-2 text-surface-300 dark:text-surface-600"
	>
		<Fa icon={faGoogle} size="lg" />
		<span>Logga in med Google</span>
	</div>
	<div
		class="rounded-container-token w-full md:max-w-72 p-4 dark:bg-surface-900 border dark:border-surface-800 flex items-center justify-center space-x-2 text-surface-300 dark:text-surface-600"
	>
		<Fa icon={faFacebook} size="lg" />
		<span>Logga in med Facebook</span>
	</div>
	<div
		class="rounded-container-token w-full md:max-w-72 p-4 dark:bg-surface-900 border dark:border-surface-800 flex items-center justify-center space-x-2 text-surface-300 dark:text-surface-600"
	>
		<Fa icon={faApple} size="lg" />
		<span>Logga in med iCloud</span>
	</div>
	<div
		class="rounded-container-token w-full md:max-w-72 p-4 dark:bg-surface-900 border dark:border-surface-800 flex items-center justify-center space-x-2 text-surface-300 dark:text-surface-600"
	>
		<Fa icon={faEnvelope} size="lg" />
		<span>Logga in med e-post</span>
	</div>
</div>
