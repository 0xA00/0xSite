<nav class="navbar">
    <div class="container">
        <a href="/" class="logo">0xA0.dev</a>
        <input type="checkbox" id="menu-toggle" class="menu-toggle" />
        <label for="menu-toggle" class="burger">
            <span></span>
            <span></span>
            <span></span>
        </label>
        
        <ul class="nav-links">
            <li><a href="https://github.com/0xA00" target="_blank">Projects</a></li>
            <li><a href="mailto:sah@0xA0.dev">Mail</a></li>
            <li><a href="/guest">Guestbook</a></li>
        </ul>
    </div>
</nav>


<style>
    .navbar {
        background: var(--background);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.1),
            0 8px 40px 10px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        transition: box-shadow 0.3s ease;
        position: sticky;
        top: 15px;
        z-index: 1000;
        width: 100%;
        margin: 0 auto;
        border-radius: 5px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        height: 80%;
    }

    .nav-links li + li::before {
        content: "|";
        color: rgba(255, 255, 255, 0.3);
        margin-right: 1rem;
        font-size: 0.85rem;
    }

    @media (max-width: 768px) {
        .nav-links li + li::before {
            display: none;
        }
    }

    .container {
        margin: 0 auto;
        padding: 0.5rem 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .logo {
        font-size: 1.5rem;
        font-weight: bold;
        color: aliceblue;
        text-decoration: none;
    }

    .menu-toggle {
        display: none;
    }

    .burger {
        display: none;
        flex-direction: column;
        gap: 5px;
        cursor: pointer;
    }

    .burger span {
        display: block;
        width: 25px;
        height: 3px;
        background: var(--text);
        border-radius: 2px;
        transition: transform 0.3s, opacity 0.3s;
    }

    .nav-links {
        list-style: none;
        display: flex;
        gap: 1rem;
        position: relative;
    }

    .nav-links li a {
        text-decoration: none;
        color: var(--text);
        transition: color 0.3s, opacity 0.3s;
    }

    .nav-links:hover li a {
        opacity: 0.4;
    }

    .nav-links li a:hover {
        opacity: 1;
    }

    @media (max-width: 768px) {
        .burger {
            display: flex;
        }

        .nav-links {
            display: none;
            flex-basis: 100%;
            flex-direction: column;
            gap: 0.5rem;
            padding: 1rem 0 0;
        }

        .menu-toggle:checked ~ .nav-links {
            display: flex;
        }

        .menu-toggle:checked ~ .burger span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }

        .menu-toggle:checked ~ .burger span:nth-child(2) {
            opacity: 0;
        }

        .menu-toggle:checked ~ .burger span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    }
</style>