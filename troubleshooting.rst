.. _troubleshooting-section:

===============
Troubleshooting
===============

NethSecurity is a sophisticated firewall system with numerous interconnected components. 
While the system automates many configurations seamlessly, occasional breakdowns can occur.

You can create a support request and report issues to the Nethesis support team or the NethServer community forum.

For stable releases, you can open a ticket on the `Nethesis helpdesk portal <https://helpdesk.nethesis.it>`_ if your machine has a subscription.

For unstable releases, you can open a new thread on the `NethServer community English-only forum <https://community.nethserver.org>`_ in the NethSecurity category.
If you are a Nethesis partner, you can open a new Italian thread on the `Nethesis partner community <https://partner.nethesis.it>`_ in the NethSecurity category.

When opening a support request or reporting an issue, you should follow these guidelines to ensure a quick and effective resolution:

* Assign clear and descriptive titles to each ticket or discussion.
* Provide complete and detailed information in each request.
* Include screenshots, logs, and any other relevant information to aid in troubleshooting.
* Collaborate with the support team by providing feedback and responding to their inquiries.


**1. Gather information**

Before creating a support request, it's crucial to gather as much information as possible about the issue you're facing. This helps the support team identify and resolve the problem quickly.

Your support request should include the following:

* **Your system configuration:** This includes the version of NethSecurity you're using; you can find the information inside the Dashboard page.
  Please report the full version like ``8 23.05.2-ns.0.0.1-beta1-96-ga759afb``
* **The problem you're encountering:** Describe the problem in detail, including the steps you took to reproduce it.
* **Any error messages:** If you receive any error messages, include them in your request.
  You can use the :ref:`user interface <troubleshooting_ui-section>` to gather this information,
  or access the command line and use ``less /var/log/messages`` to find the relevant logs.
* **Any changes you made:** If you made any changes to your system configuration, list them in your request.
* **Your desired outcome:** What do you hope to achieve by contacting support?

**2. Describe the problem objectively**

When describing the problem, focus on objective symptoms. Avoid subjective statements like "it's not working" or "it's slow." Instead, describe what happens when you perform specific actions.

Example: instead of saying "The firewall isn't working," you could say "When I try to access a website, I receive this error message."

**3. Respond to requests for information**

If the support team asks you to perform tests or provide additional details, do so promptly and thoroughly. The more information you provide, the easier it is for them to solve the issue.

**4. Communicate the outcome of the solution**

Once the support team offers a solution, test it and communicate the outcome. If it resolved the problem, let them know. If not, provide additional information so they can continue investigating.

**5. Don't reboot if the problem is blocking**

Avoid rebooting the system if the problem is blocking. Rebooting can sometimes worsen the issue. Instead, contact support and work with them to resolve it.

**6. Multiple tickets or discussions for the same issue**

It is recommended to open "n" tickets or discussions for "n" different requests, even if they relate to the same underlying problem.
While it may seem rigid and inconvenient, this approach offers significant advantages:

* **Improved workload parallelization:** Allows the support team to work on multiple aspects of the problem simultaneously.
* **Faster resolution by specialists:** Different requests can be assigned to different specialists with relevant expertise, accelerating resolution.
* **More effective problem-solving:** Focuses attention on each individual request, avoiding confusion and disorientation.
* **Enhanced priority management:** Enables assigning different priorities to each request based on urgency and impact.
* **Better communication:** Facilitates clear communication between the support team and you, ensuring dedicated discussion for each issue.


.. _troubleshooting_ui-section:

Gathering information from the user interface
=============================================

When issues arise, the user interface (UI) displays an error message capturing the nature of the problem.

The error message provides valuable information, presenting the details of the request and the encountered error in JSON format.
To assist in diagnosing and resolving the issue, users can utilize the ``Copy command`` button.
Clicking this button allows you to retrieve the command that resulted in the error.
Simply paste this copied command into a shell to obtain more detailed information.

When reporting an error to the support team, it's crucial to provide the following essential information:

1. **Copied Command:**
   Paste the command copied using the ``Copy command`` button.

2. **Execution Output:**
   For further assistance, execute the copied command and report the output.

If the provided information is insufficient, in extreme cases, it may be necessary to share the content of the JavaScript console if the error is present.
Follow your browser's instructions (usually accessed by pressing ``F12``), copy the entire console content, and paste it for a more in-depth analysis.
Your collaboration in providing accurate and detailed information ensures a more effective and timely resolution to any issues encountered with NethSecurity.
