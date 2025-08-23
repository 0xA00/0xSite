<script>
import { onMount , onDestroy} from 'svelte';

let chrs = $state('');
let cmins = $state('');
let csecs = $state('');
let ampm = $state('');
let cdate = $state('');
/**
 * @type {number | null | undefined}
 */
let interv = null;

function upTime()
{
    let now = new Date();
    chrs = (now.getHours() % 12).toString().padStart(2, '0');
    cmins = now.getMinutes().toString().padStart(2, '0');
    csecs = now.getSeconds().toString().padStart(2, '0');
    ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    cdate = now.toLocaleDateString('en-US', { weekday: 'long',
                 year: 'numeric',
                 month: 'long',
                 day: 'numeric' }).toLowerCase();
}

function startClock()
{
    upTime();
    const now = new Date();
    const msnextssec = 1000 - now.getMilliseconds();

    setTimeout(() => {
        upTime();
        interv = setInterval(upTime, 1000);
    }, msnextssec);
}


startClock();


onDestroy(() => {
     if (interv) {
            clearInterval(interv);
        }
});

</script>

<div class="panel">
    <div class="panel-label">Clock</div>
    <div class="clock">
        <span>{chrs}:{cmins}:{csecs} {ampm}</span>
        <span>{cdate}</span>
    </div>
</div>

<style>
.clock {
    display: flex;
    flex-direction: column;
}

.panel {
    width: fit-content;
}
</style>