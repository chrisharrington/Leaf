using System;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace IssueTracker.Common.Data.Blob
{
	public abstract class BaseBlobManager : IBlobManager
	{
		private readonly CloudBlobClient _client;

		protected string Container { get; private set; }

		protected BaseBlobManager(string container)
		{
			if (string.IsNullOrEmpty(container))
				throw new ArgumentNullException("container");

			Container = container;

			_client = CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("StorageConnectionString")).CreateCloudBlobClient();
		}

		public void Upload(Blob blob)
		{
			var container = GetContainer();
			var cloudBlob = container.GetBlockBlobReference(blob.Id.ToString());
			cloudBlob.UploadFromStream(blob.Contents);
		}

		private CloudBlobContainer GetContainer()
		{
			var container = _client.GetContainerReference(Container);
			container.CreateIfNotExists();
			return container;
		}
	}
}
