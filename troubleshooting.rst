.. _troubleshooting-section:

===============
Troubleshooting
===============

NethSecurity is a sophisticated firewall system with numerous interconnected components. 
While the system automates many configurations seamlessly, occasional breakdowns can occur.
When issues arise, the user interface (UI) displays an error message capturing the nature of the problem.

The error message provides valuable information, presenting the details of the request and the encountered error in JSON format.
To assist in diagnosing and resolving the issue, users can utilize the ``Copy command`` button.
Clicking this button allows you to retrieve the command that resulted in the error.
Simply paste this copied command into a shell to obtain more detailed information.

In the event you require support, you can reach out directly to Nethesis if you have a subscription.
Alternatively, community support is available at `https://community.nethserver.org`.

When reporting an error to the support team, it's crucial to provide the following essential information:

1. **Request and Response Contents:**
   Include the content of the ``Request`` and ``Response`` sections found in the error message.

2. **Copied Command:**
   Paste the command copied using the ``Copy command`` button.

3. **Execution Output:**
   For further assistance, execute the copied command and report the output.

If the provided information is insufficient, in extreme cases, it may be necessary to share the content of the JavaScript console if the error is present.
Follow your browser's instructions (usually accessed by pressing ``F12``), copy the entire console content, and paste it for a more in-depth analysis.
Your collaboration in providing accurate and detailed information ensures a more effective and timely resolution to any issues encountered with NethSecurity.