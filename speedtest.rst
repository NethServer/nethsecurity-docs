=========
Speedtest
=========

The Speedtest tool is a widely used application for measuring the speed and performance of an internet connection.
It provides users with detailed information about their download and upload speeds, as well as their ping and jitter.
This tool is essential for diagnosing network issues, verifying service provider claims, and ensuring optimal performance for various online activities.

In NethSecurity the Speedtest tool is available as a built-in feature accessible only from the command line.

Usage
=====

Speedtest automatically selects the best server based on the user's location.
To run a speed test, simply type the following command in the terminal: ::

  speedtest

This command will perform a full test, including latency, download, and upload speed tests.
The selection of the server is based on the user's location and the server's availability.
Sometimes, the server selection may not be optimal, resulting in inaccurate speed test results.

To overcome this issue, users can force the selection of the server by using the ``--force-by-latency-test`` option: ::

The selection of the server can be tuned using a latency check: ::

  speedtest --force-by-latency-test
  
MultiWAN
========

The speedtest tool randomly selects a server to perform the test.
In a MultiWAN environment, the server selection can be influenced by the WAN interface used to reach the server.

It is possible to force the selection of the WAN interface using mwan3 wrapper.

Given a WAN device named ``wan1``, the following command will run the speedtest using the selected interface: ::

  mwan3 use wan1 speedtest --force-by-latency-test
  